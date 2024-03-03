import { Inter } from "next/font/google";
import { Question, getQuestionLinks, getQuestions } from "@/lib/scraper";
import { useEffect, useState } from "react";
import Dropdown from "@/components/dropdown";
import Spinner from "@/components/spinner";
import InputText from "@/components/inputtext";
import { providerOptions } from "@/lib/examtopics";

const inter = Inter({ subsets: ["latin"] });

type ScraperState = {
  provider?: string;
  examCode?: string;
  isInProgress?: boolean;
  lastDiscussionListPageIndex?: number;
  lastQuestionLinkIndex?: number;
  questionLinks?: string[];
  questions?: Question[];
};

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useState<ScraperState>({});

  useEffect(() => {
    // Reset fields
    setState(prev => ({
      ...prev,
      examCode: "",
      lastDiscussionListPageIndex: undefined,
      lastQuestionLinkIndex: undefined,
      questionLinks: undefined,
      questions: undefined,
    }));
  }, [state?.provider]);

  const setIsInProgress = (value: boolean) => {
    setState(prev => ({...prev, isInProgress: value}));
  };

  const handleClick = async () => {
    setIsInProgress(true);
    await handleScrape();
    setIsInProgress(false);
  };

  const handleScrape = async () => {
    if (!state?.provider || !state?.examCode) return;
    let links: string[];
    let res: any;
    // No question links
    if (state?.lastQuestionLinkIndex === undefined || !state.questionLinks) {
      res = await getQuestionLinks(state.provider, state.examCode, state.lastDiscussionListPageIndex ?? 1);
      links = res.data.links;
      setState(prev => ({...prev, questionLinks: [...(prev?.questionLinks ?? []), ...links]}));
      if (res.status !== "success") {
        setState(prev => ({...prev, lastDiscussionListPageIndex: res.data.lastIndex}));
        return;
      }
    }
    // Failed getting questions previously, resume from last index
    else {
      links = state?.questionLinks.slice(state?.lastQuestionLinkIndex);
    }
    // More questions not parsed
    if (links.length + (state?.lastQuestionLinkIndex ?? 0) > (state?.questions?.length ?? 0)) {
      res = await getQuestions(links);
      setState(prev => ({...prev, questions: res.data.questions}));
      if (res.status !== "success") {
        setState(prev => ({...prev, lastQuestionLinkIndex: res.data.lastIndex}));
        return;
      }
    }
  }

  const isInputDisabled = !state?.provider || !state?.examCode || state.isInProgress;
  const isScrapingInterrupted = state?.lastDiscussionListPageIndex !== undefined || (state?.lastQuestionLinkIndex !== undefined && state?.questionLinks);

  return (
    <main
      className={`container mx-auto h-screen`}
    >
      {isLoading && <Spinner />}
      <div className="h-full max-w-[32rem] mx-auto flex flex-col justify-center">
        <div className="flex flex-wrap gap-4 justify-center items-center">
          <Dropdown
            className="flex-1 min-w-60"
            buttonClassName="w-full"
            menuClassName="overflow-y-auto max-h-72"
            value={state?.provider}
            onChange={value => setState(prev => ({...prev, provider: value as string}))}
            options={providerOptions}
            placeholder="Select exam provider"
            disabled={state?.isInProgress}
          />
          <InputText
            className="flex-1 min-w-60"
            boxClassName="text-center"
            value={state?.examCode}
            onChange={e => setState(prev => ({...prev, examCode: e.target.value}))}
            placeholder="Exam code"
            disabled={state?.isInProgress}
          />
        </div>
        <button
          className="button-default w-full mt-4"
          disabled={isInputDisabled}
          onClick={handleClick}
        >
          {state?.isInProgress ? "Scraping ... " : isScrapingInterrupted ? "Resume" : "Start"}
        </button>
      </div>
    </main>
  );
}

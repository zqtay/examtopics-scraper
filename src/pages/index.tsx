import { Inter } from "next/font/google";
import { Question, ScraperState, getQuestionLinks, getQuestions } from "@/lib/scraper";
import { useContext, useEffect, useState } from "react";
import Dropdown from "@/components/ui/dropdown";
import Spinner from "@/components/ui/spinner";
import InputText from "@/components/ui/inputtext";
import { providerOptions } from "@/lib/examtopics";
import { SettingsContext } from "@/context/settings";
import Settings from "@/components/scraper/settings";
import { saveAs } from 'file-saver';

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [state, setState] = useState<ScraperState>({ provider: "", examCode: "" });
  const { settings } = useContext(SettingsContext);

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
    setState(prev => ({ ...prev, isInProgress: value }));
  };

  const handleStartScrape = async () => {
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
      res = await getQuestionLinks(
        state.provider.toLowerCase(),
        state.examCode.toLowerCase(),
        state.lastDiscussionListPageIndex ?? 1,
        undefined,
        settings.questionLinks.batchSize,
        settings.questionLinks.sleepDuration
      );
      links = res.data.links;
      setState(prev => ({ ...prev, questionLinks: [...(prev?.questionLinks ?? []), ...links] }));
      if (res.status === "success") {
        setState(prev => ({ ...prev, lastDiscussionListPageIndex: undefined }));
      } else {
        setState(prev => ({ ...prev, lastDiscussionListPageIndex: res.data.lastIndex }));
        return;
      }
    }
    // Failed getting questions previously, resume from last index
    else {
      links = state?.questionLinks;
    }
    // More questions not parsed
    if (links.length + (state?.lastQuestionLinkIndex ?? 0) > (state?.questions?.length ?? 0)) {
      res = await getQuestions(
        links,
        state?.lastQuestionLinkIndex,
        undefined,
        settings.questions.batchSize,
        settings.questions.sleepDuration
      );
      setState(prev => ({ ...prev, questions: [...(prev?.questions ?? []), ...res.data.questions] }));
      if (res.status === "success") {
        setState(prev => ({ ...prev, lastQuestionLinkIndex: undefined }));
      } else {
        setState(prev => ({ ...prev, lastQuestionLinkIndex: res.data.lastIndex }));
        return;
      }
    }
  };

  const handleExport = async () => {
    const blob = new Blob([JSON.stringify(state)], { type: "text/plain;charset=utf-8" });
    saveAs(
      blob,
      `${state?.provider}-${state.examCode}-${state?.questions?.length}.json`
    );
  };

  // Input not provided or scraping in progress
  const isInputDisabled = !state?.provider || !state?.examCode || state.isInProgress;
  // Error happened during scraping, last page index was saved
  const isInterrupted = state?.lastDiscussionListPageIndex !== undefined ||
    (state?.lastQuestionLinkIndex !== undefined && Boolean(state?.questionLinks));
  // All questions are parsed
  const isCompleted = state?.questionLinks && state?.questions &&
    state?.questionLinks?.length === state?.questions?.length;

  return (
    <div className="max-w-[48rem] mx-auto flex flex-col justify-center">
      <div className="flex flex-wrap gap-4 justify-center items-center">
        <Dropdown
          className="flex-1 min-w-60"
          buttonClassName="w-full"
          menuClassName="overflow-y-auto max-h-72"
          value={state?.provider}
          onChange={value => setState(prev => ({ ...prev, provider: value as string }))}
          options={providerOptions}
          placeholder="Select exam provider"
          disabled={state?.isInProgress}
        />
        <InputText
          className="flex-1 min-w-60"
          boxClassName="text-center"
          value={state?.examCode}
          onChange={e => setState(prev => ({ ...prev, examCode: e.target.value }))}
          placeholder="Exam code"
          disabled={state?.isInProgress || isInterrupted}
        />
      </div>
      {!isCompleted &&
        <button
          className="button-default w-full mt-4"
          disabled={isInputDisabled}
          onClick={handleStartScrape}
        >
          {state?.isInProgress ? "Scraping ... " :
            isInterrupted ? "Resume" : "Start"
          }
        </button>
      }
      {(isInterrupted || isCompleted) &&
        <button
          className="button-default w-full mt-4"
          disabled={isInputDisabled}
          onClick={handleExport}
        >
          Export
        </button>
      }
      <hr className="my-4" />
      <Settings disabled={state?.isInProgress} />
    </div>
  );
}

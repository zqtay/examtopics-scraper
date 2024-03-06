import { Inter } from "next/font/google";
import { Question, ScraperState, getQuestionLinks, getQuestions } from "@/lib/scraper";
import { useContext, useEffect, useRef, useState } from "react";
import Dropdown from "@/components/ui/dropdown";
import Spinner from "@/components/ui/spinner";
import InputText from "@/components/ui/inputtext";
import { providerOptions } from "@/lib/examtopics";
import { SettingsContext } from "@/context/settings";
import Settings from "@/components/scraper/settings";
import { saveAs } from 'file-saver';
import ProgressBar from "@/components/ui/progressbar";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [state, setState] = useState<ScraperState>({ provider: "", examCode: "" });
  const [progress, setProgress] = useState({
    step: 1,
    value: 0,
    max: 0,
  });
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

  const updateProgress = (value: number, max: number) => {
    setProgress(prev => ({ ...prev, value, max }));
  };

  const setIsInProgress = (value: boolean) => {
    setState(prev => ({ ...prev, isInProgress: value }));
  };

  const handleStartScrape = async () => {
    setIsInProgress(true);
    try {
      await handleScrape();
    } catch (error) {
      console.error(error);
    }
    setIsInProgress(false);
  };

  const handleScrape = async () => {
    if (!state?.provider || !state?.examCode) return;
    let links: string[] = [];
    let res: any;
    // No question links
    if (!state.questionLinks || state?.lastDiscussionListPageIndex !== undefined) {
      setProgress(prev => ({ ...prev, step: 1 }));
      res = await getQuestionLinks(
        state.provider.toLowerCase(),
        state.examCode.toLowerCase(),
        state.lastDiscussionListPageIndex,
        undefined,
        settings.questionLinks.batchSize,
        settings.questionLinks.sleepDuration,
        updateProgress,
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
    links = [...(state?.questionLinks ?? []), ...links];
    // More questions not parsed
    if (links.length + (state?.lastQuestionLinkIndex ?? 0) > (state?.questions?.length ?? 0)) {
      setProgress(prev => ({ ...prev, step: 2 }));
      res = await getQuestions(
        links,
        state?.lastQuestionLinkIndex,
        undefined,
        settings.questions.batchSize,
        settings.questions.sleepDuration,
        updateProgress,
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
  const isInterrupted = !state?.isInProgress && (state?.lastDiscussionListPageIndex !== undefined ||
    (state?.lastQuestionLinkIndex !== undefined && Boolean(state?.questionLinks)));
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
      {(state?.isInProgress || isCompleted || isInterrupted) &&
        <div className="mt-4">
          <div className="text-sm mb-1">
            {state?.isInProgress &&
              `Fetching ${progress.step === 1 ? " question links" : progress.step === 2 ? " questions" : ""} ...`
            }
            {isInterrupted && `Failed`}
            {isCompleted && `Completed`}
          </div>
          <ProgressBar
            value={progress.value}
            max={progress.max}
            showValue={Boolean(progress.max)}
            barClassName="h-4"
            labelClassName="text-xs"
          />
        </div>
      }
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

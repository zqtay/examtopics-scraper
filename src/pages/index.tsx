import { Inter } from "next/font/google";
import { Question, ScraperState, getQuestionLinks, getQuestions } from "@/lib/scraper";
import { FC, useContext, useEffect, useRef, useState } from "react";
import Dropdown from "@/components/ui/dropdown";
import Spinner from "@/components/ui/spinner";
import InputText from "@/components/ui/inputtext";
import { providerOptions } from "@/lib/examtopics";
import { SettingsContext } from "@/context/settings";
import Settings from "@/components/scraper/settings";
import { saveAs } from 'file-saver';
import ProgressBar from "@/components/ui/progressbar";
import { useRouter } from "next/router";
import { ExamContext } from "@/context/exam";
import { AdminScraperState } from "@/lib/admin";

const inter = Inter({ subsets: ["latin"] });

const Home: FC = () => {
  const router = useRouter();
  const { examState, saveExamState, exportExamState } = useContext(ExamContext);
  const [state, setState] = useState<ScraperState>({ provider: "", examCode: "" });
  const [progress, setProgress] = useState({
    step: 1,
    value: 0,
    max: 0,
  });
  const { settings } = useContext(SettingsContext);
  const [adminState, setAdminState] = useState<AdminScraperState>();

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
    // Use new variable to avoid wrong concatenation after reconnect
    const allLinks = [...(state?.questionLinks ?? []), ...links];
    // More questions not parsed
    if (allLinks.length + (state?.lastQuestionLinkIndex ?? 0) > (state?.questions?.length ?? 0)) {
      setProgress(prev => ({ ...prev, step: 2 }));
      res = await getQuestions(
        allLinks,
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

  // Input not provided or scraping in progress
  const isInputDisabled = !state?.provider || !state?.examCode || state.isInProgress;
  // Error happened during scraping, last page index was saved
  const isInterrupted = !state?.isInProgress && (state?.lastDiscussionListPageIndex !== undefined ||
    (state?.lastQuestionLinkIndex !== undefined && Boolean(state?.questionLinks)));
  // All questions are parsed
  const isCompleted = state?.questionLinks && state?.questions &&
    state?.questionLinks?.length === state?.questions?.length;

    
  useEffect(() => {
    fetch("/api/admin/scraper").then(res => res.json()).then(setAdminState);
  }, []);

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

  useEffect(() => {
    if (isInterrupted || isCompleted) {
      saveExamState({
        provider: state.provider,
        examCode: state.examCode,
        questions: state.questions
      });
    }
  }, [isInterrupted, isCompleted]);

  if (adminState === undefined) {
    return <></>;
  } else if (!adminState?.enabled) {
    return <div className="max-w-[48rem] mx-auto flex flex-col justify-center">
      <div className="text-lg font-semibold text-center mt-48" >
        Scraper function is disabled
      </div>
      <button className="button-default w-full mt-4" onClick={() => window.location.href = "/exam"}>Go to Exam</button>
    </div>;
  }

  return (
    <div className="max-w-[48rem] mx-auto flex flex-col justify-center">
      <div className="flex flex-col md:flex-row gap-4 md:gap-2 justify-center items-center">
        <Dropdown
          className="flex-1 w-full"
          buttonClassName="w-full"
          menuClassName="overflow-y-auto max-h-72"
          value={state?.provider}
          onChange={value => setState(prev => ({ ...prev, provider: value as string }))}
          options={providerOptions}
          placeholder="Select exam provider"
          disabled={state?.isInProgress}
        />
        <InputText
          className="flex-1 w-full"
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
          onClick={() => {
            if (examState)
              exportExamState();
          }}
        >
          Export
        </button>
      }
      {(isInterrupted || isCompleted) &&
        <button
          className="button-default w-full mt-4"
          onClick={() => router.push("/exam")}
        >
          Go to exam
        </button>
      }
      <hr className="my-4" />
      <Settings disabled={state?.isInProgress} />
    </div>
  );
}

export default Home;
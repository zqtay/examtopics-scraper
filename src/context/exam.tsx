import { ExamState } from "@/lib/examtopics";
import { Question } from "@/lib/scraper";
import saveAs from "file-saver";
import { useState, createContext, PropsWithChildren, Dispatch, SetStateAction, useEffect } from 'react';

export const ExamContext = createContext({} as ExamContextProps);

export type SessionState = {
  currentQuestion: Question | undefined;
  pastQuestionUrls: string[];
};

export type ExamContextProps = {
  examState: ExamState | undefined;
  saveExamState: (value: ExamState) => void;
  exportExamState: () => Promise<void>;
  sessionState: SessionState;
  setSessionState: Dispatch<SetStateAction<SessionState>>;
};

export const ExamStateProvider = ({ children }: PropsWithChildren) => {
  const [examState, setExamState] = useState<ExamState>();
  const [sessionState, setSessionState] = useState<SessionState>({
    currentQuestion: undefined,
    pastQuestionUrls: [],
  });

  const exportExamState = async () => {
    const blob = new Blob([JSON.stringify(examState)], { type: "text/plain;charset=utf-8" });
    saveAs(
      blob,
      `${examState?.provider}-${examState?.examCode}-${examState?.questions?.length}.json`
    );
  };

  useEffect(() => {
    const storedValue = localStorage.getItem("exam");
    if (!storedValue) return;
    try {
      const stored = JSON.parse(storedValue);
      setExamState(stored);
    }
    catch (error) {
      // Ignore error, stored value does not exist or invalid
    }
  }, []);

  const saveExamState = (value: ExamState) => {
    localStorage.setItem("exam", JSON.stringify(value)),
    setExamState(value);
  };

  const value = {
    examState,
    saveExamState,
    exportExamState,
    sessionState,
    setSessionState,
  };

  return <ExamContext.Provider value={value}>{children}</ExamContext.Provider>;
};

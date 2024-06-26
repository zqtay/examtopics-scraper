import { ExamContextProps, ExamSession } from "@/types/exam";
import { ExamState } from "@/types/exam";
import saveAs from "file-saver";
import { useState, createContext, PropsWithChildren, useEffect } from 'react';

export const ExamContext = createContext({} as ExamContextProps);

export const ExamStateProvider = ({ children }: PropsWithChildren) => {
  const [examState, setExamState] = useState<ExamState>();
  const [examSession, setExamSession] = useState<ExamSession>({
    order: "ascending",
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
    examSession,
    setExamSession,
  };

  return <ExamContext.Provider value={value}>{children}</ExamContext.Provider>;
};

import { ExamState } from "@/lib/examtopics";
import saveAs from "file-saver";
import { useState, createContext, PropsWithChildren, Dispatch, SetStateAction } from 'react';

export const ExamContext = createContext({} as ExamContextProps);

export type ExamContextProps = {
  examState: ExamState | undefined;
  setExamState: Dispatch<SetStateAction<ExamState | undefined>>;
  exportExamState: () => Promise<void>;
};

export const ExamStateProvider = ({ children }: PropsWithChildren) => {
  const [examState, setExamState] = useState<ExamState>();

  const exportExamState = async () => {
    const blob = new Blob([JSON.stringify(examState)], { type: "text/plain;charset=utf-8" });
    saveAs(
      blob,
      `${examState?.provider}-${examState?.examCode}-${examState?.questions?.length}.json`
    );
  };

  const value = {
    examState,
    setExamState,
    exportExamState,
  };

  return <ExamContext.Provider value={value}>{children}</ExamContext.Provider>;
};

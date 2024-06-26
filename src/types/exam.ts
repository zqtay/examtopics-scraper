
import { Dispatch, SetStateAction } from "react";

export type ExamState = {
  provider?: string;
  examCode?: string;
  questions?: Question[];
};

export type Question = {
  topic: string | undefined;
  index: string | undefined;
  url: string | undefined;
  body: string | undefined;
  answer: string;
  answerDescription: string;
  options: string[] | undefined;
  votes: {
    answer: string;
    count: number;
    isMostVoted: boolean;
  }[] | undefined;
  comments: {
    date?: string;
    voteCount?: number;
    content?: string;
  }[];
  notes?: string;
  marked?: boolean;
};

export type ExamSession = {
  order: "ascending" | "random";
  currentQuestion: Question | undefined;
  pastQuestionUrls: string[];
};

export type ExamContextProps = {
  examState: ExamState | undefined;
  saveExamState: (value: ExamState) => void;
  exportExamState: () => Promise<void>;
  examSession: ExamSession;
  setExamSession: Dispatch<SetStateAction<ExamSession>>;
};
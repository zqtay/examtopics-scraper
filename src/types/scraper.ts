import { Question, ExamState } from "./exam";

export type GetQuestionLinksResponse = {
  status: "success" | "error";
  data: {
    lastIndex?: number;
    links: string[];
  },
};

export type GetQuestionsResponse = {
  status: "success" | "error";
  data: {
    lastIndex?: number;
    questions: Question[];
  },
};

export type ScraperState = {
  isInProgress?: boolean;
  lastDiscussionListPageIndex?: number;
  lastQuestionLinkIndex?: number;
  questionLinks?: string[];
} & ExamState;

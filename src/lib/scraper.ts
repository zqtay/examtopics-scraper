import { ExamState } from "./examtopics";
import { fetchPage } from "./fetcher";
import { sleep } from "./utils";

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

export const PROXY_BASE_URL = "/api/examtopics";
const ORIGIN_BASE_URL = "https://www.examtopics.com";

export const getQuestionLinks = async (
  provider: string,
  exam: string,
  start: number = 1,
  end: number | undefined,
  batchSize: number,
  sleepDuration: number,
  setProgress?: (value: number, max: number) => any,
): Promise<GetQuestionLinksResponse> => {
  // Get last page number first
  if (!end) {
    const doc = await fetchPage(`${PROXY_BASE_URL}/discussions/${provider}`);
    end = parseInt(doc.querySelectorAll(".discussion-list-page-indicator strong")[1].innerHTML.trim());
  }

  console.log(`Parsing from discussion page ${start} to ${end}`);

  let results: string[] = [];
  let parsedCount = 0;
  const totalCount = end - start + 1;
  let pageIndex = start;

  while (pageIndex <= end) {
    const currentBatchSize = pageIndex + batchSize - 1 > end ?
      (end - pageIndex + 1) : batchSize;
    const batch = Array(currentBatchSize).fill(0).map((e, i) => i + pageIndex);
    // Fetch pages in batch
    const promises = batch.map(index =>
      fetchPage(`${PROXY_BASE_URL}/discussions/${provider}/${index}`)
        .then(doc => {
          let links = (Array.from(doc.getElementsByClassName("discussion-link")))
            .map(e => e.getAttribute('href')?.replace(/\/+$/, ''));
          links = links.filter(e => {
            return e !== null && e?.includes(exam);
          });
          console.log(`Parsed page ${index}`);
          return links as string[];
        })
    );
    // Concat the results
    try {
      (await Promise.all(promises)).forEach(links => {
        if (links) results = results.concat(links);
      });
    }
    catch (error) {
      return {
        status: "error",
        data: {
          lastIndex: pageIndex,
          links: results,
        },
      };
    }
    parsedCount = pageIndex + currentBatchSize - start;
    console.log(`Parsed ${parsedCount} pages`);
    console.log(`Collated ${results.length} question links`);
    // Callback for set progress
    if (setProgress) {
      setProgress(parsedCount, totalCount);
    }
    // Delay before next batch
    if (sleepDuration > 0) {
      sleep(sleepDuration);
    }
    // Next batch start index
    pageIndex = pageIndex + batchSize;
  }

  return {
    status: "success",
    data: {
      links: results,
    },
  };
};

export const getQuestions = async (
  links: string[],
  start: number = 0,
  end: number | undefined,
  batchSize: number,
  sleepDuration: number,
  setProgress?: (value: number, max: number) => any,
): Promise<GetQuestionsResponse> => {
  let results: Question[] = [];
  end = end ?? links.length - 1;
  let parsedCount = 0;
  const totalCount = end - start + 1;
  let pageIndex = start;

  while (pageIndex <= end) {
    const batch = links.slice(pageIndex, pageIndex + batchSize);
    // Fetch pages in batch
    const promises = batch.map(link =>
      fetchPage(`${PROXY_BASE_URL}${link}`)
        .then(doc => {
          const [, topicNumber] = link?.match(/topic-(\d+)/) ?? [];
          const [, questionNumber] = link?.match(/question-(\d+)/) ?? [];
          const body = doc.querySelector(".question-body > .card-text")?.innerHTML.trim();
          const options = Array.from(doc.querySelectorAll(".question-choices-container li"))
            .map((e: Element) =>
              e.innerHTML?.trim() ?? ""
            );
          const answer = doc.getElementsByClassName("correct-answer")[0]?.innerHTML.trim();
          const answerDescription = doc.getElementsByClassName("answer-description")[0]?.innerHTML.trim();
          let votes = doc.querySelector(".voted-answers-tally script")?.innerHTML.trim() ?? undefined;
          if (votes) {
            votes = JSON.parse(votes).map((e: any) => ({
              answer: e.voted_answers,
              count: e.vote_count,
              isMostVoted: e.is_most_voted
            }));
          }
          const comments = Array.from(doc.getElementsByClassName("comment-container"))
            .map(e => {
              const date = new Date((e.getElementsByClassName("comment-date")[0] as HTMLElement).title);
              const voteCount = Number(e.getElementsByClassName("upvote-count")[0].textContent?.trim());
              return {
                date: isNaN(date.valueOf()) ? undefined : date.toISOString(),
                voteCount: isNaN(voteCount) ? undefined : voteCount,
                content: e.getElementsByClassName("comment-content")[0].innerHTML,
              };
            });
          console.log(`Parsed topic ${topicNumber} question ${questionNumber}`);
          return {
            url: `${ORIGIN_BASE_URL}${link}`,
            topic: topicNumber,
            index: questionNumber,
            body,
            answer,
            answerDescription,
            options: options.length === 0 ? undefined : options,
            votes: votes as Question["votes"],
            comments
          };
        })
    );
    // Concat the results
    try {
      (await Promise.all(promises)).forEach(data => {
        if (data) results.push(data);
      });
    }
    catch (error) {
      return {
        status: "error",
        data: {
          lastIndex: pageIndex,
          questions: results,
        },
      };
    }
    parsedCount = results.length;
    console.log(`Parsed ${parsedCount} questions`);
    if (setProgress) {
      setProgress(parsedCount, totalCount);
    }
    // Delay before next batch
    if (sleepDuration > 0) {
      sleep(sleepDuration);
    }
    // Next batch start index
    pageIndex = pageIndex + batchSize;
  }

  return {
    status: "success",
    data: {
      questions: results,
    },
  };
};
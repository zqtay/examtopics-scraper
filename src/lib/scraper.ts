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
  comments: string[];
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
  provider?: string;
  examCode?: string;
  isInProgress?: boolean;
  lastDiscussionListPageIndex?: number;
  lastQuestionLinkIndex?: number;
  questionLinks?: string[];
  questions?: Question[];
};

export const PROXY_BASE_URL = "/api/examtopics";
const ORIGIN_BASE_URL = "https://www.examtopics.com";

export const getQuestionLinks = async (
  provider: string,
  exam: string,
  start: number = 1,
  end: number | undefined,
  batchSize: number,
  sleepDuration: number,
): Promise<GetQuestionLinksResponse> => {
  // Get last page number first
  let lastPageIndex = end;
  if (!lastPageIndex) {
    const doc = await fetchPage(`${PROXY_BASE_URL}/discussions/${provider}`);
    lastPageIndex = parseInt(doc.querySelectorAll(".discussion-list-page-indicator strong")[1].innerHTML.trim());
  }

  console.log(`Parsing from discussion page ${start} to ${lastPageIndex}`);

  let results: string[] = [];

  let pageIndex = start;
  while (pageIndex <= lastPageIndex) {
    const currentBatchSize = pageIndex + batchSize - 1 > lastPageIndex ?
      (lastPageIndex - pageIndex + 1) : batchSize;
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
    console.log(`Parsed ${pageIndex + currentBatchSize - start} pages`);
    console.log(`Collated ${results.length} question links`);
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
): Promise<GetQuestionsResponse> => {
  let results: Question[] = [];
  const lastPageIndex = end ?? links.length - 1;
  let pageIndex = start;

  while (pageIndex <= lastPageIndex) {
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
          const comments = Array.from(doc.getElementsByClassName("comment-content"))
            .map(e => e.innerHTML.trim());
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
    console.log(`Parsed ${results.length} questions`);
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
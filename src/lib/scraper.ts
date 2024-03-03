import { fetchPage } from "./fetcher";

export type Question = {
  topic: string | undefined;
  index: string | undefined;
  body: string | undefined;
  answer: string;
  answerDescription: string;
  options: string[] | undefined;
  votes: string | undefined;
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

const PROXY_BASE_URL = "/api/examtopics";
const ORIGIN_BASE_URL = "https://www.examtopics.com";
const FETCH_BATCH_SIZE = 10;

export const getQuestionLinks = async (
  provider: string, exam: string, start?: number, end?: number
): Promise<GetQuestionLinksResponse> => {
  // Get last page number first
  let lastPageIndex = end;
  if (!lastPageIndex) {
    const doc = await fetchPage(`${PROXY_BASE_URL}/discussions/${provider}`);
    lastPageIndex = parseInt(doc.querySelectorAll(".discussion-list-page-indicator strong")[1].innerHTML.trim());
  }
  if (!start) start = 1;

  console.log(`Parsing from discussion page ${start} to ${lastPageIndex}`);

  let results: string[] = [];
  const lastBatchIndex = Math.ceil((lastPageIndex - start) / FETCH_BATCH_SIZE) - 1;

  for (let batchIndex = 0; batchIndex <= lastBatchIndex; batchIndex++) {
    const startPageIndexInBatch = (batchIndex * FETCH_BATCH_SIZE) + start;
    // Get array of page index
    const indexes = batchIndex === lastBatchIndex ?
      Array(lastPageIndex - startPageIndexInBatch + 1).fill(0).map((e, i) => i + startPageIndexInBatch) :
      Array(FETCH_BATCH_SIZE).fill(0).map((e, i) => i + startPageIndexInBatch);

    // Fetch pages in batch
    const promises = indexes.map(index =>
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
          lastIndex: startPageIndexInBatch,
          links: results,
        },
      };
    }
    console.log(`Parsed ${batchIndex === lastBatchIndex ?
      (lastPageIndex - start + 1) :
      (batchIndex + 1) * FETCH_BATCH_SIZE
      } pages`);
    console.log(`Collated ${results.length} question links`);
  }
  return {
    status: "success",
    data: {
      links: results,
    },
  };
};

export const getQuestions = async (links: string[]): Promise<GetQuestionsResponse> => {
  let results: Question[] = [];
  const lastPageIndex = links.length;
  const lastBatchIndex = Math.ceil(lastPageIndex / FETCH_BATCH_SIZE) - 1;

  for (let batchIndex = 0; batchIndex <= lastBatchIndex; batchIndex++) {
    const startIndexInBatch = batchIndex * FETCH_BATCH_SIZE;
    const lastIndexInBatch = batchIndex === lastBatchIndex ?
      lastPageIndex :
      startIndexInBatch + FETCH_BATCH_SIZE - 1;
    const batch = links.slice(startIndexInBatch, lastIndexInBatch + 1);

    // Fetch pages in batch
    const promises = batch.map(link =>
      fetchPage(`${PROXY_BASE_URL}${link}`)
        .then(doc => {
          const [, topicNumber] = link?.match(/topic-(\d+)/) ?? [];
          const [, questionNumber] = link?.match(/question-(\d+)/) ?? [];
          const body = doc.querySelector(".question-body > .card-text")?.innerHTML.trim();
          const options = Array.from(doc.querySelectorAll(".question-choices-container li"))
            .map((e: Element) =>
              e.textContent?.trim().replaceAll('\t', "").replaceAll('\n', "") ?? ""
            );
          const answer = doc.getElementsByClassName("correct-answer")[0]?.innerHTML.trim();
          const answerDescription = doc.getElementsByClassName("answer-description")[0]?.innerHTML.trim();
          let votes = doc.querySelector(".voted-answers-tally script")?.innerHTML.trim();
          if (votes) {
            votes = JSON.parse(votes).map((e: any) => ({
              answer: e.voted_answers,
              count: e.vote_count,
              is_most_voted: e.is_most_voted
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
            votes,
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
          lastIndex: startIndexInBatch,
          questions: results,
        },
      };
    }
    console.log(`Parsed ${results.length} questions`);
  }

  return {
    status: "success",
    data: {
      questions: results,
    },
  };
};
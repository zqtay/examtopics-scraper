import { fetchPage } from "./fetcher";

export type Question = {
  topic: string | null;
  index: string | null;
  body: string | undefined;
  answer: string;
  answer_description: string;
  options: string[];
  votes: string | undefined;
  comments: string[];
};

const PROXY_BASE_URL = "/api/examtopics";
const ORIGIN_BASE_URL = "https://www.examtopics.com";
const FETCH_BATCH_SIZE = 10;

const getQuestionLinks = async (
  provider: string, exam: string, start?: number, end?: number
) => {
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
            .map(e => e.getAttribute('href'));
          links = links.filter(e => {
            return e !== null && e?.includes(exam)
          });
          console.log(`Parsed page ${index}`);
          return links as string[];
        })
        .catch((error) => console.log(error))
    );
    // Concat the results
    (await Promise.all(promises)).forEach(links => {
      if (links) results = results.concat(links);
    });
    console.log(`Parsed ${batchIndex === lastBatchIndex ?
      (lastPageIndex - start + 1) :
      (batchIndex + 1) * FETCH_BATCH_SIZE
      } pages`);
    console.log(`Collated ${results.length} question links`);
  }
  return results;
};

const getQuestions = async (links: string[]) => {
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
          const header = doc.querySelector(".question-discussion-header > div")?.innerHTML.trim();
          const regex = /(\s*)Question #:\s(\d+)(\s*)Topic #:\s(\d+)/;
          const match = header?.match(regex);
          const questionNumber = match ? match[2] : null;
          const topicNumber = match ? match[4] : null;
          const body = doc.querySelector(".question-body > .card-text")?.innerHTML.trim();
          const options = Array.from(doc.querySelectorAll(".question-choices-container li"))
            .map(e => e.innerHTML.trim()
              .replaceAll('\t', "")
              .replaceAll('\n', ""));
          const answer = doc.getElementsByClassName("correct-answer")[0]?.innerHTML.trim();
          const answer_description = doc.getElementsByClassName("answer-description")[0]?.innerHTML.trim();
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
            answer_description,
            options,
            votes,
            comments
          };
        })
        .catch((error) => console.log(error))
    );
    // Concat the results
    (await Promise.all(promises)).forEach(data => {
      if (data) results.push(data);
    });
    console.log(`Parsed ${results.length} questions`);
  }

  return results;
};

export const scrape = async (provider: string, exam: string) => {
  console.log(`Provider: ${provider}`);
  console.log(`Exam: ${exam}`);

  const links = await getQuestionLinks(provider, exam);
  console.log(links);
  const questions = await getQuestions(links);
  console.log(questions);
  return questions;
};
const EXAMTOPICS_BASE_URL = "https://www.examtopics.com/discussions";
const FETCH_BATCH_SIZE = 20;

const parser = new DOMParser();

const fetchPage = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed request");
  const body = await res.text();
  const doc = parser.parseFromString(body, 'text/html');
  return doc;
};

const sleep = (milliseconds) => {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds) {
      break;
    }
  }
};

const getQuestionLinks = async (provider, exam, start = 1, end = null) => {
  // Get last page number first
  let lastPageIndex = end;
  if (!lastPageIndex) {
    const doc = await fetchPage(`${EXAMTOPICS_BASE_URL}/${provider}`);
	lastPageIndex = parseInt(doc.querySelectorAll(".discussion-list-page-indicator strong")[1].innerText);
  }
 
  console.log(`Parsing from discussion page ${start} to ${lastPageIndex}`);
  
  let results = [];
  const lastBatchIndex = Math.ceil(lastPageIndex / FETCH_BATCH_SIZE) - 1;

  for (let batchIndex = 0; batchIndex <= lastBatchIndex; batchIndex++) {
    const startPageIndexInBatch = (batchIndex * FETCH_BATCH_SIZE) + start;
    // Get array of page index
    const indexes = batchIndex === lastBatchIndex ?
      Array(lastPageIndex - startPageIndexInBatch + 1).fill().map((e, i) => i + startPageIndexInBatch) :
      Array(FETCH_BATCH_SIZE).fill().map((e, i) => i + startPageIndexInBatch);

    // Fetch pages in batch
    const promises = indexes.map(e =>
      fetchPage(`${EXAMTOPICS_BASE_URL}/${provider}/${e}`)
        .then(doc => {
          const links = Array.from(doc.getElementsByClassName("discussion-link"))
            .map(e => e.href)
            .filter(e => e.includes(exam));
          console.log(`Parsed page ${e}`);
          return links;
        })
    );
    // Concat the results
    (await Promise.all(promises)).forEach(links => {
      results = results.concat(links);
    });
    console.log(`Parsed ${
	  batchIndex === lastBatchIndex ? 
	  (lastPageIndex - start + 1) : 
	  (batchIndex + 1) * FETCH_BATCH_SIZE
	} pages`);
	console.log(`Collated ${results.length} question links`);
  }
  return results;
};

const getQuestions = async (links) => {
  let results = [];
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
      fetchPage(link)
        .then(doc => {
          const header = doc.querySelector(".question-discussion-header > div").innerText.trim();
          const regex = /(\s*)Question #:\s(\d+)(\s*)Topic #:\s(\d+)/;
          const match = header.match(regex);
          const questionNumber = match ? match[2] : null;
          const topicNumber = match ? match[4] : null;
          const body = doc.querySelector(".question-body > .card-text").innerText.trim();
          const options = Array.from(doc.querySelectorAll(".question-choices-container li"))
            .map(e => e.innerText.trim()
              .replaceAll('\t', "")
              .replaceAll('\n', ""));
		      const answer = doc.getElementsByClassName("correct-answer")[0].innerText.trim();
		      const answer_description = doc.getElementsByClassName("answer-description")[0].innerText.trim();
          const votes = Array.from(doc.querySelectorAll('.vote-distribution-bar > div:not([data-original-title=""])'))
            .map(e => e.innerText.trim());
          const comments = Array.from(doc.getElementsByClassName("comment-content"))
            .map(e => e.innerText.trim());

          console.log(`Parsed question ${questionNumber}`);

          return {
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
    );
    // Concat the results
    (await Promise.all(promises)).forEach(data => {
      results.push(data);
    });
    console.log(`Parsed ${results.length} questions`);
  }

  return results;
};

const main = async () => {
  const provider = "microsoft";
  const exam = "az-204";
  const start = 1;
  const end = 3;
  console.log(`Provider: ${provider}`);
  console.log(`Exam: ${exam}`);

  const links = await getQuestionLinks(provider, exam, start, end);
  console.log(links)
  const questions = await getQuestions(links);
  console.log(questions);
  return questions;
};

const questions = await main();

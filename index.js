const EXAMTOPICS_BASE_URL = "https://www.examtopics.com/discussions";
const FETCH_BATCH_SIZE = 10;

const parser = new DOMParser();

const getQuestionLinks = async (provider, exam) => {
  // Get last page number first
  let doc = await fetchPage(`${EXAMTOPICS_BASE_URL}/${provider}`);
  const lastPageIndex = parseInt(doc.querySelectorAll(".discussion-list-page-indicator strong")[1].innerText);
  console.log(`Provider: ${provider}`);
  console.log(`Exam: ${exam}`);
  console.log(`Total ${lastPageIndex} pages`);

  let results = [];
  const lastBatchIndex = Math.floor(lastPageIndex / FETCH_BATCH_SIZE);

  for (let batchIndex = 0; batchIndex <= lastBatchIndex; batchIndex++) {
    const startPageIndexInBatch = batchIndex * FETCH_BATCH_SIZE + 1;
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
    console.log(`Parsed ${batchIndex === lastBatchIndex ? lastPageIndex : (batchIndex + 1) * FETCH_BATCH_SIZE} pages`);
    // Prevent robot detection
    sleep(100);
  }
  return results;
};

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

const links = await getQuestionLinks("microsoft", "az-204");
const EXAMTOPICS_BASE_URL = "https://www.examtopics.com/discussions";

const parser = new DOMParser();

const getQuestionLinks = async (provider, exam) => {
  let pageNumber = 1;
  let url = `${EXAMTOPICS_BASE_URL}/${provider}/${pageNumber}`;
  // Get last page number first
  let doc = await fetchPage(url);
  const lastPageNumber = parseInt(doc.querySelectorAll(".discussion-list-page-indicator strong")[1].innerText);

  let results = [];
  console.log(`Total ${lastPageNumber} pages`);
  for (pageNumber = 1; pageNumber <= lastPageNumber; pageNumber++) {
    url = `${EXAMTOPICS_BASE_URL}/${provider}/${pageNumber}`;
    if (pageNumber !== 1) {
      doc = await fetchPage(url);
    }
    const links = Array.from(doc.getElementsByClassName("discussion-link"))
      .map(e => e.href)
      .filter(e => e.includes(exam));
    results = results.concat(links);
    console.log(`Parsed ${pageNumber} pages, ${results.length} links`);
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
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <title>ExamTopics Scraper</title>
        <meta name="description" content="An app for scraping and running ExamTopics questions" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <meta property="og:type" content="website"></meta>
        <meta property="og:title" content="ExamTopics Scraper"></meta>
        <meta property="og:url" content="https://examtopics-scraper.vercel.app"></meta>
        <meta property="og:description" content="An app for scraping and running ExamTopics questions" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

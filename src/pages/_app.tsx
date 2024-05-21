import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import Layout from "@/layout";
import { SettingsProvider } from "@/context/settings";
import { ExamStateProvider } from "@/context/exam";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return <>
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
    <SettingsProvider>
      <ExamStateProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ExamStateProvider>
    </SettingsProvider>
  </>;
}

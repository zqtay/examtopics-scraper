import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import Layout from "@/layout";
import { SettingsProvider } from "@/context/settings";
import { ExamStateProvider } from "@/context/exam";

export default function App({ Component, pageProps }: AppProps) {
  return <SettingsProvider>
    <ExamStateProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ExamStateProvider>
  </SettingsProvider>;
}

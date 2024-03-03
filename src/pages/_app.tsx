import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import Layout from "@/layout";
import { SettingsProvider } from "@/context/settings";

export default function App({ Component, pageProps }: AppProps) {
  return <SettingsProvider>
    <Layout>
      <Component {...pageProps} />
    </Layout>
  </SettingsProvider>;
}

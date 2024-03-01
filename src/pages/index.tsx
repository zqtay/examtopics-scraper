import Image from "next/image";
import { Inter } from "next/font/google";
import { scrape } from "@/lib/scraper";
import { useEffect, useState } from "react";
import { fetchPage } from "@/lib/fetcher";
import Dropdown from "@/components/dropdown";
import Spinner from "@/components/spinner";
import InputText from "@/components/inputtext";

const inter = Inter({ subsets: ["latin"] });

const regex = /discussions\/(.*?)((\/|$))/;

export default function Home() {
  const [providers, setProviders] = useState<{ label: string; value: string; }[]>();
  const [selectedProvider, setSelectedProvider] = useState<string>();
  const [examCode, setExamCode] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPage("/api/examtopics/discussions")
      .then(doc => {
        const list = Array.from(doc.getElementsByClassName("dicussion-title-container"));
        const providers = list.map(e => {
          const link = e.getElementsByTagName("a")[0];
          return {
            label: link.innerHTML.trim(),
            value: link.href.match(regex)?.[1] ?? "",
          };
        });
        setProviders(providers);
        setIsLoading(false);
      });
  }, []);

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      {isLoading && <Spinner />}
      <Dropdown
        value={selectedProvider}
        options={providers}
        placeholder={"Select exam provider"}
        onChange={value => setSelectedProvider(value as string)}
      />
      {selectedProvider}
      <InputText
        value={examCode}
        onChange={e => setExamCode(e.target.value)}
        placeholder="Exam code"
      />
      <button
        className="p-2 rounded border"
        onClick={() => {
          if (selectedProvider)
            scrape(selectedProvider, examCode);
        }}
      >
        Start
      </button>
    </main>
  );
}

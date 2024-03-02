import Image from "next/image";
import { Inter } from "next/font/google";
import { scrape } from "@/lib/scraper";
import { useEffect, useState } from "react";
import { fetchPage } from "@/lib/fetcher";
import Dropdown from "@/components/dropdown";
import Spinner from "@/components/spinner";
import InputText from "@/components/inputtext";
import { providerOptions } from "@/lib/examtopics";

const inter = Inter({ subsets: ["latin"] });



export default function Home() {
  const [selectedProvider, setSelectedProvider] = useState<string>();
  const [examCode, setExamCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {

  }, []);

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-center p-24 ${inter.className}`}
    >
      {isLoading && <Spinner />}
      <div className="flex gap-4">
        <Dropdown
          className="overflow-y-auto max-h-72"
          value={selectedProvider}
          options={providerOptions}
          placeholder={"Select exam provider"}
          onChange={value => setSelectedProvider(value as string)}
        />
        <InputText
          className={"text-center"}
          value={examCode}
          onChange={e => setExamCode(e.target.value)}
          placeholder="Exam code"
        />
      </div>
      <button
        className="button-default"
        disabled={!selectedProvider && !examCode}
        onClick={() => {
          if (selectedProvider && examCode)
            scrape(selectedProvider, examCode.toLowerCase());
        }}
      >
        Start
      </button>
    </main>
  );
}

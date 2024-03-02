import { Inter } from "next/font/google";
import { scrape } from "@/lib/scraper";
import { useEffect, useState } from "react";
import Dropdown from "@/components/dropdown";
import Spinner from "@/components/spinner";
import InputText from "@/components/inputtext";
import { providerOptions } from "@/lib/examtopics";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [selectedProvider, setSelectedProvider] = useState<string>();
  const [examCode, setExamCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInProgress, setIsInProgress] = useState(false);

  useEffect(() => {
    // Reset exam code field
    setExamCode("");
  }, [selectedProvider]);

  const handleClick = async () => {
    setIsInProgress(true);
    if (selectedProvider && examCode) {
      await scrape(selectedProvider, examCode.toLowerCase());
      setIsInProgress(false);
    }
  };

  return (
    <main
      className={`container mx-auto h-screen`}
    >
      {isLoading && <Spinner />}
      <div className="h-full max-w-[32rem] mx-auto flex flex-col justify-center">
        <div className="flex flex-wrap gap-4 justify-center items-center">
          <Dropdown
            className="flex-1 min-w-60"
            buttonClassName="w-full"
            menuClassName="overflow-y-auto max-h-72"
            options={providerOptions}
            placeholder="Select exam provider"
            disabled={isInProgress}
            value={selectedProvider}
            onChange={value => setSelectedProvider(value as string)}
          />
          <InputText
            className="flex-1 min-w-60"
            boxClassName="text-center"
            value={examCode}
            onChange={e => setExamCode(e.target.value)}
            placeholder="Exam code"
            disabled={isInProgress}
          />
        </div>
        <button
          className="button-default w-full mt-4"
          disabled={!selectedProvider || !examCode || isInProgress}
          onClick={handleClick}
        >
          {isInProgress ? "Scraping ... " : "Start"}
        </button>
      </div>
    </main>
  );
}

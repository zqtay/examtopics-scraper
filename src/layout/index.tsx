import Dropdown from "@/components/ui/dropdown";
import { ExamContext } from "@/context/exam";
import Link from "next/link";
import { useRouter } from "next/router";
import { ChangeEvent, FC, PropsWithChildren, useContext, useRef } from "react";
import { FaEllipsisVertical } from "react-icons/fa6";

const Layout: FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter();
  const { examState, exportExamState, saveExamState } = useContext(ExamContext);
  const importRef = useRef<HTMLInputElement>(null);
  const isExamPage = router.pathname === "/exam";

  const menuItems = [
    ...(isExamPage) ? [{
      label: <div onClick={() => importRef.current?.click()}>Import</div>,
      value: "import"
    }] : [],
    ...(examState?.provider && examState?.examCode) ? [{
      label: <div onClick={exportExamState}>Export</div>,
      value: "export"
    }] : [],
  ];

  return <>
    <header className="border-b-2">
      <div className="container px-2 py-3 mx-auto flex w-full items-center">
        <span className="flex-1" />
        <Link className="flex-1 min-w-max text-xl font-semibold text-center" href="/">
          ExamTopics Scraper
        </Link>
        <div className="flex-1">
          <Dropdown
            options={menuItems}
            buttonClassName="ml-auto button-alt items-end border-0 p-0"
            menuClassName="w-32 right-0 mt-4"
            label={null}
            icon={<FaEllipsisVertical
              size="1.25rem"
            />}
          />
          <input
            ref={importRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={async (e: ChangeEvent<HTMLInputElement>) => {
              e.preventDefault();
              const reader = new FileReader();
              reader.onload = async (e) => {
                const text = (e.target?.result);
                if (typeof text !== "string") return;
                const data = JSON.parse(text);
                saveExamState(data);
              };
              const file = e.target.files?.[0];
              if (file) reader.readAsText(file);
            }}
          />
        </div>
      </div>
    </header>
    <main
      className="container px-2 py-4 mx-auto"
    >
      {children}
    </main>
  </>;
};

export default Layout;
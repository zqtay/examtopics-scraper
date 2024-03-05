import Dropdown from "@/components/ui/dropdown";
import { ExamContext } from "@/context/exam";
import Link from "next/link";
import { FC, PropsWithChildren, useContext } from "react";
import { FaFileDownload } from "react-icons/fa";
import { FaEllipsisVertical } from "react-icons/fa6";

const Layout: FC<PropsWithChildren> = ({ children }) => {
  const { examState, exportExamState } = useContext(ExamContext);
  return <>
    <header className="border-b-2">
      <div className="container px-2 py-3 mx-auto flex w-full items-center">
        <span className="w-6" />
        <Link className="flex-1 text-xl font-semibold text-center" href="/">
          ExamTopics Scraper
        </Link>
        {(examState?.provider && examState?.examCode) &&
          <FaFileDownload
            size="1.25rem"
            className="w-6 cursor-pointer"
            onClick={exportExamState}
          />
        }
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
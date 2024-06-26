import SearchBox from "@/components/exam/seachbox";
import Dropdown from "@/components/ui/dropdown";
import { ExamContext } from "@/context/exam";
import _ from "lodash";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ChangeEvent, FC, PropsWithChildren, useContext, useRef } from "react";
import { FaEllipsisVertical } from "react-icons/fa6";

const Layout: FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter();
  const { examState, exportExamState, saveExamState, examSession, setExamSession } = useContext(ExamContext);
  const importRef = useRef<HTMLInputElement>(null);
  const { data: session } = useSession();

  const isExamPage = router.pathname === "/exam";
  const hasExamState = examState?.provider && examState?.examCode;

  const menuItems = [
    ...(router.pathname === "/") ? [{
      label: <Link href="/exam">Exam</Link>,
      value: "import"
    }] : [],
    ...(isExamPage) ? [{
      label: <div onClick={() => importRef.current?.click()}>Import</div>,
      value: "import"
    }] : [],
    ...(hasExamState) ? [{
      label: <div onClick={exportExamState}>Export</div>,
      value: "export"
    }] : [],
    ...(session?.user?.role === "admin") ? [{
      label: <Link href="/admin">Admin</Link>,
      value: "admin"
    }] : []
  ];

  const handleFileRead = async (e: ChangeEvent<HTMLInputElement>) => {
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
  };

  return <>
    <header className="container px-2 py-3 mx-auto relative">
      <div className="h-full max-w-[48rem] mx-auto justify-center flex items-center gap-2 relative">
        {(hasExamState && isExamPage) ?
          <Link className="text-xl font-semibold" href="/">
            ETS
          </Link> :
          <div className="flex-1" />
        }
        <div className="text-center flex-1">
          {(hasExamState && isExamPage) ?
            <SearchBox
              questions={examState.questions}
              session={examSession}
              setSession={setExamSession}
            /> :
            <Link className="block text-xl font-semibold w-max mx-auto" href="/">
              ExamTopics Scraper
            </Link>
          }
        </div>
        <div className={(hasExamState && isExamPage) ? "" : "flex-1"}>
          <Dropdown
            options={menuItems}
            buttonClassName="ml-auto button-alt items-end border-0 px-0 py-1"
            menuClassName="w-20 right-0 mt-4 z-20"
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
            onChange={handleFileRead}
          />
        </div>
      </div>
    </header>
    <hr />
    <main
      className="container px-2 py-4 mx-auto"
    >
      {children}
    </main>
  </>;
};


export default Layout;
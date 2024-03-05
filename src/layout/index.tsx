import Link from "next/link";
import { FC, PropsWithChildren } from "react";

const Layout: FC<PropsWithChildren> = ({ children }) => {
  return <>
    <header className="px-2 py-3 border-b-2 mx-auto text-center">
      <Link className="text-xl font-semibold" href="/">
        ExamTopics Scraper
      </Link>
    </header>
    <main
      className="container px-2 py-4 mx-auto"
    >
      {children}
    </main>
  </>;
};

export default Layout;
import { FC, PropsWithChildren } from "react";

const Layout: FC<PropsWithChildren> = ({ children }) => {
  return <>
    <header className="px-2 py-4 border-b-2 mx-auto text-center">
      <a className="text-2xl font-semibold" href="/">
        ExamTopics Scraper
      </a>
    </header>
    <main
      className="container px-2 py-4 mx-auto"
    >
      {children}
    </main>
  </>;
};

export default Layout;
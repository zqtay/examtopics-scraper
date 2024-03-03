import { FC, PropsWithChildren } from "react";

const Layout: FC<PropsWithChildren> = ({ children }) => {
  return <main
    className="container px-2 mx-auto h-screen"
  >
    {children}
  </main>;
};

export default Layout;
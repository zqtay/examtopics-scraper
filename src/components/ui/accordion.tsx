import { FC, ReactNode } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

type AccordionProps = {
  label: string;
  collapsed?: boolean;
  children: ReactNode;
  toggle?: () => void;
};

const Accordion: FC<AccordionProps> = ({ label, collapsed, children, toggle }) => {
  return <div>
    <div
      className="flex font-semibold mb-4 items-center cursor-pointer"
      onClick={toggle}
    >
      {label}
      {collapsed ?
        <FaChevronDown className="ml-auto" /> :
        <FaChevronUp className="ml-auto" />
      }
    </div>
    {!collapsed && children}
  </div>;
};

export default Accordion;
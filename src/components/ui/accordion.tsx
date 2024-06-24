import { FC, ReactNode, useEffect, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

type AccordionProps = {
  label: ReactNode;
  collapsed?: boolean;
  children: ReactNode;
  toggle?: () => void;
};

const Accordion: FC<AccordionProps> = ({ label, collapsed, children, toggle }) => {
  const [isCollapsed, setIsCollapsed] = useState(collapsed ?? false);

  const _toggler = () => {
    setIsCollapsed(prev => !prev);
  };

  useEffect(() => {
    // Overwrite internal state
    setIsCollapsed(collapsed ?? false);
  }, [collapsed])

  return <div>
    <div
      className="flex font-semibold mb-4 items-center cursor-pointer"
      onClick={toggle ?? _toggler}
    >
      {label}
      {isCollapsed ?
        <FaChevronDown className="ml-auto" /> :
        <FaChevronUp className="ml-auto" />
      }
    </div>
    {!isCollapsed && children}
  </div>;
};

export default Accordion;
import classNames from "classnames";
import { FC, MouseEventHandler } from "react";

type BadgeProps = {
  children?: React.ReactNode;
  color?: keyof typeof colors;
  className?: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
};

const colors = {
  default: `bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300`,
  dark: `bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300`
};

const Badge: FC<BadgeProps> = ({ children, color, className, onClick }) => {
  return <div
    className={classNames(
      `text-sm font-medium px-2.5 py-0.5 rounded`,
      color ? colors[color] : colors.default,
      {
        "cursor-pointer": onClick,
      },
      className
    )}
    onClick={onClick}
  >
    {children}
  </div>;
};

export default Badge;
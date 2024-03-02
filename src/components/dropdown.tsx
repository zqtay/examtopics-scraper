import classNames from "classnames";
import { Dispatch, FC, SetStateAction, useEffect, useRef, useState } from "react";

type ItemValue = string | number | undefined;

type Item = {
  label: string;
  value: ItemValue;
};

type ItemProps = Item & {
  setSelected: Dispatch<SetStateAction<string | number | undefined>>;
  setMenuVisible: Dispatch<SetStateAction<boolean>>;
};

type DropdownProps = {
  options?: Item[];
  value?: ItemValue;
  onChange?: (value: ItemValue) => any;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  buttonClassName?: string;
  menuClassName?: string;
};

const Item: FC<ItemProps> = ({ label, value, setSelected, setMenuVisible }) => {
  return <li className="cursor-pointer">
    <div
      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
      onClick={() => {
        setSelected(value);
        setMenuVisible(false);
      }}
    >
      {label}
    </div>
  </li>;
};

const Dropdown: FC<DropdownProps> = ({
  options, value, onChange, placeholder, disabled, className, buttonClassName, menuClassName
}) => {
  const [selected, setSelected] = useState<ItemValue>(value);
  const [menuVisible, setMenuVisible] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (onChange) onChange(selected);
  }, [selected]);

  useEffect(() => {
    setMenuVisible(false);
  }, [disabled])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node) &&
        buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setMenuVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef, buttonRef]);

  return <div className={classNames("dropdown", className)}>
    <button
      ref={buttonRef}
      className={classNames("dropdown-button", buttonClassName)}
      type="button"
      onClick={() => setMenuVisible(prev => !prev)}
      disabled={disabled}
    >
      <span className="flex-1">{value ? (options?.find(e => e.value === value)?.label ?? "") : (placeholder ?? "")}</span>
      <svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
      </svg>
    </button>
    <div
      ref={menuRef}
      className={classNames("dropdown-menu", menuClassName, {
        hidden: !menuVisible
      })}
    >
      <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
        {options && options.map((e, i) =>
          <Item
            key={i}
            label={e.label}
            value={e.value}
            setSelected={setSelected}
            setMenuVisible={setMenuVisible}
          />
        )}
      </ul>
    </div>
  </div>;
};

export default Dropdown;
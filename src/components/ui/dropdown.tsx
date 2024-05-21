import classNames from "classnames";
import { Dispatch, FC, ReactNode, SetStateAction, useEffect, useRef, useState } from "react";
import { FaAngleDown } from "react-icons/fa";

type ItemValue = string | number | undefined;

type Item = {
  label: ReactNode;
  value: ItemValue;
  disabled?: boolean;
};

type ItemProps = Item & {
  active?: boolean;
  setSelected: Dispatch<SetStateAction<string | number | undefined>>;
  setMenuVisible: Dispatch<SetStateAction<boolean>>;
};

type DropdownProps = {
  options?: Item[];
  value?: ItemValue;
  onChange?: (value: ItemValue) => any;
  placeholder?: string;
  disabled?: boolean;
  label?: ReactNode;
  icon?: ReactNode;
  className?: string;
  buttonClassName?: string;
  menuClassName?: string;
  toggleMenu?: (visible: boolean) => boolean;
  menuHeader?: ReactNode;
};

const Item: FC<ItemProps> = ({ label, value, setSelected, setMenuVisible, disabled, active }) => {
  return <li>
    <div
      className={classNames("block px-4 py-2",
        {
          "dropdown-menu-item": !disabled,
          "dropdown-menu-item-active": active,
        }
      )}
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
  options, 
  value, 
  onChange, 
  placeholder, 
  disabled, 
  label, 
  icon, 
  className, 
  buttonClassName, 
  menuClassName, 
  toggleMenu, 
  menuHeader
}) => {
  const [selected, setSelected] = useState<ItemValue>(value);
  const [menuVisible, setMenuVisible] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    setMenuVisible(prev => {
      if (toggleMenu) return toggleMenu(!prev);
      return !prev;
    });
  }

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
      className={classNames("button-default flex items-center", buttonClassName)}
      type="button"
      onClick={handleToggle}
      disabled={disabled}
    >
      {label ?? ((label === undefined) &&
        <span className="flex-1">
          {value ? (options?.find(e => e.value === value)?.label ?? "") : (placeholder ?? "")}
        </span>
      )}
      {icon ?? ((icon === undefined) && <FaAngleDown />)}
    </button>
    <div
      ref={menuRef}
      className={classNames("dropdown-menu", menuClassName, {
        hidden: !menuVisible
      })}
    >
      {menuHeader && <div className="py-2 px-4">
        {menuHeader}
      </div>} 
      <ul className="dropdown-menu-items">
        {options && options.map((e, i) =>
          <Item
            key={i}
            label={e.label}
            value={e.value}
            disabled={e.disabled}
            setSelected={setSelected}
            setMenuVisible={setMenuVisible}
            active={value === e.value}
          />
        )}
      </ul>
    </div>
  </div>;
};

export default Dropdown;
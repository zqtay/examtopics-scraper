import { ChangeEvent, FC } from "react";
import classNames from "classnames";

type CheckboxProps = {
  id?: string;
  label?: string;
  checked?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  labelClassName?: string;
};

const Checkbox: FC<CheckboxProps> = ({ id, label, checked, onChange, className, labelClassName }) => {
  return <div className="flex items-center">
    <input
      id={id}
      type="checkbox"
      value=""
      checked={checked}
      className={classNames("checkbox", className)}
      onChange={onChange}
    />
    <label
      htmlFor={id}
      className={classNames("checkbox-label", labelClassName)}
    >
      {label}
    </label>
  </div>;
};

export default Checkbox;
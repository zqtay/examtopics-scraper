import classNames from "classnames";
import React, { ChangeEventHandler, FC, ReactNode } from "react";

type InputTextProps = {
  id?: string;
  label?: string;
  type?: string;
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  labelClassName?: string;
  boxClassName?: string;
  icon?: ReactNode;
};

const InputText: FC<InputTextProps> = ({
  id, label, type, value, onChange, placeholder, required, disabled, className, labelClassName, boxClassName, icon
}) => {
  return <div className={classNames(className)}>
    {label && <label htmlFor={id} className={classNames("inputtext-label", labelClassName)}>
      {label}
    </label>}
    <div className="relative flex items-center">
      {icon && <div className="absolute text-sm ml-3 text-gray-400">
        {icon}
      </div>}
      <input
        type={type}
        id={id}
        className={classNames("inputtext-box", {
          "pl-8": icon
        }, boxClassName)}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        value={value}
        onChange={onChange}
      />
    </div>
  </div>;
};

export default InputText;
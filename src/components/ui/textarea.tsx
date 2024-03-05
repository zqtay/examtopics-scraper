import classNames from "classnames";
import { ChangeEventHandler, FC } from "react";

type TextAreaProps = {
  id?: string;
  label?: string;
  value?: string;
  onChange?: ChangeEventHandler<HTMLTextAreaElement>;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  labelClassName?: string;
  boxClassName?: string;
};

const TextArea: FC<TextAreaProps> = ({
  id, label, value, onChange, placeholder, required, disabled, className, labelClassName, boxClassName
}) => {
  return <div className={classNames(className)}>
    {label && <label htmlFor={id} className={classNames("inputtext-label", labelClassName)}>
      {label}
    </label>}
    <textarea
      id={id}
      className={classNames("inputtext-box", boxClassName)}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      value={value}
      onChange={onChange}
    />
  </div>;
};

export default TextArea;
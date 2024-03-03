import classNames from "classnames";
import { ChangeEventHandler, FC } from "react";

type FileInputProps = {
  id?: string;
  label?: string;
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  labelClassName?: string;
  boxClassName?: string;
};

const FileInput: FC<FileInputProps> = ({
  id, label, value, onChange, placeholder, required, disabled, className, labelClassName, boxClassName
}) => {
  return <div className={classNames(className)}>
    {label && <label htmlFor={id} className={classNames("fileinput-label", labelClassName)}>
      {label}
    </label>}
    <input
      type="file"
      id={id}
      className={classNames("fileinput-box", boxClassName)}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      value={value}
      onChange={onChange}
    />
  </div>;
};

export default FileInput;
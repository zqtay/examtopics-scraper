import classNames from "classnames";
import { ChangeEventHandler, FC } from "react";

type InputTextProps = {
  id?: string;
  label?: string;
  type?: string;
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  required?: boolean;
  className?: string;
};

const InputText: FC<InputTextProps> = ({ id, label, type, value, onChange, placeholder, required, className }) => {
  return <div>
    {label && <label htmlFor={id} className="inputtext-label">
      {label}
    </label>}
    <input
      type={type}
      id={id}
      className={classNames("inputtext-box", className)}
      placeholder={placeholder}
      required={required}
      value={value}
      onChange={onChange}
    />
  </div>;
};

export default InputText;
import classNames from "classnames";
import { ChangeEventHandler, FC, ReactNode } from "react";

type DropzoneProps = {
  id?: string;
  label?: string;
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  icon?: ReactNode;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  accept?: string;
  className?: string;
  labelClassName?: string;
  boxClassName?: string;
};

const Dropzone: FC<DropzoneProps> = ({
  id, label, value, onChange, placeholder, icon, helperText, required, disabled, accept, className, labelClassName, boxClassName
}) => {
  return <div className={classNames("flex items-center justify-center", className)}>
    <label
      htmlFor={id}
      className={classNames("dropzone-box", boxClassName)}
    >
      <div className={classNames("dropzone-label", labelClassName)}>
        {icon}
        {label && <p className="mb-2 text-sm">
          {label}
        </p>}
        {helperText && <p className="text-xs">
          {helperText}
        </p>}
      </div>
      <input
        id={id}
        type="file"
        className="hidden"
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        value={value}
        onChange={onChange}
        accept={accept}
      />
    </label>
  </div>;
};

export default Dropzone;
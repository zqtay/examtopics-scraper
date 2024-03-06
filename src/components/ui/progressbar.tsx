import classNames from "classnames";
import { FC, useEffect, useState } from "react";

type ProgressBarProps = {
  className?: string;
  barClassName?: string;
  labelClassName?: string;
  value?: number;
  max?: number;
  showValue?: boolean;
  showPercent?: boolean;
};

const ProgressBar: FC<ProgressBarProps> = ({
  className, barClassName, labelClassName, value, max, showValue, showPercent
}) => {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const percent = Math.round(((value ?? 0) / (max ?? 100)) * 100);
    setPercent(percent);
  }, [max, value]);

  return <div className={classNames("progressbar-container", className)}>
    <div className={classNames("progressbar-label", labelClassName)}>
      {showValue && <span>
        {`${value}${max ? `/${max}` : ""}`}
      </span>}
      {showPercent && <span>
        {`${percent}%`}
      </span>}
    </div>
    <div
      className={classNames("progressbar-bar", barClassName)}
      style={{ width: `${percent}%` }}
    >
    </div>
  </div>;
};

export default ProgressBar;
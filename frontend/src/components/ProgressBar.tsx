import * as React from "react";
import "./ProgressBar.css";

type FillerProps = {
  percentage: number;
};

const Filler: React.FunctionComponent<FillerProps> = (props) => {
  return <div className="filler" style={{ width: `${props.percentage}%` }} />;
};

type ProgressBarProps = {
  percentage: number;
};

const ProgressBar: React.FunctionComponent<ProgressBarProps> = (props) => {
  return (
    <div className="ProgressBar">
      <Filler percentage={props.percentage} />
    </div>
  );
};

export default ProgressBar;

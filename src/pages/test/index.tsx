import { Question, ScraperState } from "@/lib/scraper";
import { ChangeEvent, FC, useContext, useEffect, useRef, useState } from "react";
import Dropzone from "@/components/ui/dropzone";
import { FaFileUpload } from "react-icons/fa";
import classNames from "classnames";

const Test = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useState<ScraperState>();
  const [currentQuestion, setCurrentQuestion] = useState<Question>();

  const handleReadFile = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = (e.target?.result);
      if (typeof text === "string") {
        const data = JSON.parse(text);
        setState(data);
      }
    };
    const file = e.target.files?.[0];
    if (file) {
      reader.readAsText(file);
    }
  };

  const handleNextQuestion = () => {
    if (!state?.questions) return;
    const index = Math.floor(Math.random() * state?.questions?.length);
    setCurrentQuestion(state?.questions[index]);
  };

  const isLoaded = state?.provider && state?.examCode && state?.questions;

  useEffect(() => {
    // Reset current question
    setCurrentQuestion(undefined);
  }, [state]);

  return (
    <div className="h-full max-w-[48rem] mx-auto flex flex-col justify-center">
      <Dropzone
        className={classNames("w-full mb-4", {
          "button-default": isLoaded
        })}
        boxClassName={classNames({
          "bg-transparent border-none hover:bg-transparent": isLoaded
        })}
        labelClassName={classNames({
          "bg-transparent text-white p-0": isLoaded
        })}
        label={!isLoaded ? "Import questions data" : `${state?.provider?.toUpperCase()} ${state?.examCode?.toUpperCase()}`}
        helperText={!isLoaded ? "JSON" : undefined}
        icon={!isLoaded ?
          <FaFileUpload className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" /> :
          undefined
        }
        accept=".json"
        onChange={handleReadFile}
      />
      {currentQuestion && <QuestionPage {...currentQuestion} />}
      {isLoaded &&
        <button
          className="button-default"
          onClick={handleNextQuestion}
        >
          {currentQuestion ? "Next" : "Start"}
        </button>
      }
    </div>
  );
};

const QuestionPage: FC<Question> = ({
  topic, index, url, body, options, answer, answerDescription, votes, comments
}) => {
  return <div>
    <div
      className="text-lg font-semibold cursor-pointer"
      onClick={() => window.open(url, '_blank')}>
      {`Topic ${topic} Question ${index}`}
    </div>
    <div dangerouslySetInnerHTML={{ __html: body ?? "" }} />
    <ul>
      {options && options?.map((e, i) => <li key={i}>{e}</li>)}
    </ul>
    <div dangerouslySetInnerHTML={{ __html: answer ?? "" }} />
    <div dangerouslySetInnerHTML={{ __html: answerDescription ?? "" }} />
    <ul>
      {votes && votes?.map((e, i) => <li key={i}>{`${e.answer}: ${e.count} votes`}</li>)}
    </ul>
    <ul>
      {comments && comments?.map((e, i) => <li key={i}>{e}</li>)}
    </ul>
  </div>;
};

export default Test;
import { Question } from "@/lib/scraper";
import { ChangeEvent, FC, useContext, useEffect, useRef, useState } from "react";
import Dropzone from "@/components/ui/dropzone";
import { FaFileUpload } from "react-icons/fa";

const Test = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState<Question[]>();
  const [currentQuestion, setCurrentQuestion] = useState<Question>();

  const handleReadFile = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = (e.target?.result);
      if (typeof text === "string") {
        const data = JSON.parse(text);
        setQuestions(data);
      }
    };
    const file = e.target.files?.[0];
    if (file) {
      reader.readAsText(file);
    }
  };

  const handleNextQuestion = () => {
    if (!questions) return;
    const index = Math.floor(Math.random() * questions?.length);
    setCurrentQuestion(questions[index]);
  };

  return (
    <div className="h-full max-w-[32rem] mx-auto flex flex-col justify-center">
      <Dropzone
        className="w-full mb-6"
        label="Import questions data"
        helperText="JSON"
        icon={<FaFileUpload className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />}
        accept=".json"
        onChange={handleReadFile}
      />
      {currentQuestion && <QuestionPage {...currentQuestion} />}
      <button
        className="button-default"
        onClick={handleNextQuestion}
      >
        Next
      </button>
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
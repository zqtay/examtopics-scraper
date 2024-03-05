import { PROXY_BASE_URL, Question, ScraperState } from "@/lib/scraper";
import { ChangeEvent, FC, ReactNode, useContext, useEffect, useRef, useState } from "react";
import Dropzone from "@/components/ui/dropzone";
import { FaFileUpload, FaSortNumericDown, FaRandom, FaChevronDown, FaChevronUp, FaListOl } from "react-icons/fa";
import classNames from "classnames";
import _ from "lodash";
import Dropdown from "@/components/ui/dropdown";
import Accordion from "@/components/ui/accordion";

const voteColors = [
  "bg-red-300",
  "bg-amber-300",
  "bg-yellow-300",
  "bg-green-300",
  "bg-cyan-300",
  "bg-blue-300",
  "bg-purple-300",
  "bg-pink-300",
];

// Add proxy path to relative path
const srcToProxyUrl = (html?: string) => {
  if (!html) return "";
  return html?.replaceAll(`src="/`, `src="${PROXY_BASE_URL}/`)
};

const Test = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useState<ScraperState>();
  const [currentQuestion, setCurrentQuestion] = useState<Question>();
  const [questions, setQuestions] = useState<Question[]>();
  const [pastQuestionUrls, setPastQuestionUrls] = useState<string[]>([]);
  const [order, setOrder] = useState<"ascending" | "random">("ascending");

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

  const handleToggleOrder = () => {
    setOrder(prev => {
      if (prev === "ascending") return "random";
      return "ascending";
    });
  };

  const handlePrev = () => {
    if (!questions || pastQuestionUrls.length < 1) return;
    const lastQuestionUrl = pastQuestionUrls[pastQuestionUrls.length - 1];
    const question = questions.find(e => e.url === lastQuestionUrl);
    // Remove last
    setPastQuestionUrls(prev => prev.slice(0, prev.length - 1));
    // Set last as current
    setCurrentQuestion(question);
  };

  const handleNext = () => {
    if (!questions) return;
    let index;
    if (order === "ascending") {
      if (currentQuestion) {
        index = questions.findIndex(e => e.url === currentQuestion?.url);
        if (index === -1) {
          index = undefined;
        } else if (index >= questions.length - 1) {
          index = 0;
        } else {
          // Next
          index += 1;
        }
      } else {
        index = 0;
      }
    } else if (order === "random") {
      index = Math.floor(Math.random() * questions?.length);
    }
    if (index !== undefined) {
      if (currentQuestion?.url) {
        // Store past questions
        setPastQuestionUrls(prev => [...prev, currentQuestion.url!]);
      }
      setCurrentQuestion(questions[index]);
    }
  };

  const handleSelect = <T,>(url?: T) => {
    if (!questions || typeof url !== "string") return;
    const question = questions.find(e => e.url === url);
    console.log(url)
    if (question) {
      if (currentQuestion?.url) {
        // Store past questions
        setPastQuestionUrls(prev => [...prev, currentQuestion.url!]);
      }
      setCurrentQuestion(question);
    }
  };

  const isLoaded = state?.provider && state?.examCode && state?.questions;

  useEffect(() => {
    // Reset current question
    setCurrentQuestion(undefined);
    if (state?.questions) {
      const _questions = state.questions.map(e => ({
        ...e,
        order: `${("0000" + e.topic).slice(-4)}-${("0000" + e.index).slice(-4)}`
      }))
      setQuestions(_.sortBy(_questions, ['order']));
    }
  }, [state]);

  return (
    <div className="h-full max-w-[48rem] mx-auto flex flex-col justify-center">
      <div className="flex gap-2 mb-4">
        <Dropzone
          className={classNames("flex-1", {
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
        {isLoaded && <>
          <Dropdown
            value={currentQuestion?.url}
            onChange={handleSelect}
            options={questions?.map(e => ({ label: `T${e.topic} Q${e.index}`, value: e.url }))}
            buttonClassName="px-3 h-full button-alt"
            menuClassName="w-24 max-h-[24rem] overflow-y-auto"
            label={null}
            icon={<FaListOl size="1.25rem" />}
          />
          <button
            className="button-alt py-1 px-3"
            onClick={handleToggleOrder}
          >
            {order === "ascending" && <FaSortNumericDown size="1.25rem" />}
            {order === "random" && <FaRandom size="1.25rem" />}
          </button>
        </>}
      </div>
      {currentQuestion && <QuestionPage {...currentQuestion} />}
      <div className="h-[40px]"></div>
      {isLoaded && <div className="fixed w-full bottom-0 left-0 bg-white">
        <div className="container mx-auto p-2">
          <div className="flex justify-center gap-2 w-full max-w-[48rem] mx-auto">
            {pastQuestionUrls.length > 0 &&
              <button
                className="button-alt flex-1"
                onClick={handlePrev}
              >
                Previous
              </button>
            }
            <button
              className="button-default flex-1"
              onClick={handleNext}
            >
              {currentQuestion ? "Next" : "Start"}
            </button>
          </div>
        </div>
      </div>
      }
    </div>
  );
};

const QuestionPage: FC<Question> = ({
  topic, index, url, body, options, answer, answerDescription, votes, comments
}) => {
  const [visible, setVisible] = useState({ secret: false, answer: false, comments: false });
  const voteCount = votes?.reduce((prev, curr) => prev + curr.count, 0);

  useEffect(() => {
    setVisible({ secret: false, answer: false, comments: false });
  }, [url]);

  return <div className="mb-2">
    <div
      className="text-lg font-semibold cursor-pointer mb-2"
      onClick={() => window.open(url, '_blank')}>
      {`Topic ${topic} Question ${index}`}
    </div>
    <div
      className="question-body"
      dangerouslySetInnerHTML={{ __html: srcToProxyUrl(body) }}
    />
    {options && <>
      <hr className="my-4" />
      <div className="font-semibold mb-2">
        Options
      </div>
      <div>
        {options?.map((e, i) => <div key={i} dangerouslySetInnerHTML={{ __html: srcToProxyUrl(e) }} />)}
      </div>
    </>
    }
    <hr className="my-4" />
    {!visible.secret &&
      <button
        className="button-default w-full"
        onClick={() => setVisible(prev => ({ ...prev, secret: true, answer: true }))}
      >
        Show answer
      </button>
    }
    {visible.secret && <>
      <Accordion
        label="Answer"
        collapsed={!visible.answer}
        toggle={() => setVisible(prev => ({ ...prev, answer: !prev.answer }))}
      >
        <div dangerouslySetInnerHTML={{ __html: srcToProxyUrl(answer) }} />
        {answerDescription && <>
          <div className="font-semibold my-2">
            Description
          </div>
          <div
            className="border rounded-md p-2"
            dangerouslySetInnerHTML={{ __html: srcToProxyUrl(answerDescription) }}
          />
        </>
        }
        {voteCount && <>
          <div className="font-semibold my-2">
            Votes
          </div>
          <div className="flex w-full rounded-md">
            {votes && votes?.map((e, i) => {
              const percent = `${Math.round((e.count / voteCount) * 100)}%`;
              return <div
                key={i}
                className={`text-xs p-1 whitespace-nowrap overflow-x-clip ${voteColors[i]}`}
                style={{ width: percent }}
              >
                {`${e.answer} ${percent}`}
              </div>;
            })}
          </div>
        </>}
      </Accordion>
      <hr className="my-4" />
      <Accordion
        label="Comments"
        collapsed={!visible.comments}
        toggle={() => setVisible(prev => ({ ...prev, comments: !prev.comments }))}
      >
        <div className="flex flex-col gap-2 break-words">
          {comments && comments?.map((e, i) => <div
            key={i}
            className="border rounded-md p-2"
          >
            {e}
          </div>)}
        </div>
      </Accordion>
    </>}
  </div>;
};

export default Test;
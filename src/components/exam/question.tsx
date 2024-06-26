import { FC, useState, useEffect, MouseEventHandler, useContext, useCallback } from "react";
import _ from "lodash";
import { FaStar, FaRegStar, FaRegThumbsUp, FaSave } from "react-icons/fa";
import { ExamContext } from "@/context/exam";
import { PROXY_BASE_URL } from "@/lib/scraper";
import { formatDateString } from "@/lib/utils";
import { Question } from "@/types/exam";
import Accordion from "../ui/accordion";
import TextArea from "../ui/textarea";

type QuestionPageProps = Question & {
};

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
  return html?.replaceAll(`src="/`, `src="${PROXY_BASE_URL}/`);
};

const QuestionPage: FC<QuestionPageProps> = ({
  topic,
  index,
  url,
  body,
  options,
  answer,
  answerDescription,
  votes,
  comments,
  notes,
  marked,
}) => {
  const { examState, saveExamState } = useContext(ExamContext);
  const [visible, setVisible] = useState({
    options: false,
    secret: false,
    answer: false,
    comments: false,
    notes: false,
  });
  const voteCount = votes?.reduce((prev, curr) => prev + curr.count, 0);
  const [notesDraft, setNotesDraft] = useState<string | undefined>(notes);

  const handleSaveNotes: MouseEventHandler = useCallback((e) => {
    e.stopPropagation();
    handleUpdateQuestion({
      url,
      notes: notesDraft
    });
  }, [notesDraft, url]);

  const handleSaveMarked: MouseEventHandler = useCallback((e) => {
    e.stopPropagation();
    handleUpdateQuestion({
      url,
      marked: !marked
    });
  }, [marked, url]);

  const handleUpdateQuestion = useCallback((value: Partial<Question>) => {
    if (!examState) return;
    let newState = examState;
    const _questions = examState?.questions ? [...examState?.questions] : [];
    const index = _questions?.findIndex(e => value.url === e.url);
    // Update question list
    if (_questions && index !== undefined && index !== -1) {
      _questions[index] = _.merge(_questions[index], value);
      newState = {
        ...examState,
        questions: _questions
      };
    }
    saveExamState(newState);
  }, [examState, saveExamState]);

  useEffect(() => {
    // Next question
    setVisible({
      options: true,
      secret: false,
      answer: false,
      comments: false,
      notes: false
    });
    setNotesDraft(notes);
  }, [url]);

  return <div>
    <div className="flex mb-2 items-center">
      <div
        className="text-lg font-semibold cursor-pointer"
        onClick={() => window.open(url, '_blank')}>
        {`Topic ${topic} Question ${index}`}
      </div>
      <div
        className="ml-4 cursor-pointer"
        onClick={handleSaveMarked}
      >
        {marked ?
          <FaStar size="1.25rem" className="text-amber-400" /> :
          <FaRegStar size="1.25rem" className="text-gray-300" />
        }
      </div>
    </div>
    <div
      className="break-words"
      dangerouslySetInnerHTML={{ __html: srcToProxyUrl(body) }}
    />
    {options && <>
      <hr className="my-4" />
      <Accordion
        label="Options"
        collapsed={!visible.options}
        toggle={() => setVisible(prev => ({ ...prev, options: !prev.options }))}
      >
        {options?.map((e, i) => <div key={i} dangerouslySetInnerHTML={{ __html: srcToProxyUrl(e) }} />)}
      </Accordion>
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
            className="border rounded-md p-2 break-words"
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
            <div className="mb-2">{e.content}</div>
            <div className="flex items-center text-xs text-gray-500">
              {formatDateString(e.date)}
              {e.voteCount && <>
                <FaRegThumbsUp className="ml-2 mr-1" /> {e.voteCount}
              </>}
            </div>
          </div>)}
        </div>
      </Accordion>
      <hr className="my-4" />
      <Accordion
        label={<div className="w-full flex gap-2 items-center">
          <div className="flex-1">Notes</div>
          {notes !== notesDraft &&
            <FaSave
              className="mr-2"
              onClick={handleSaveNotes}
            />
          }
        </div>}
        collapsed={!visible.notes}
        toggle={() => setVisible(prev => ({ ...prev, notes: !prev.notes }))}
      >
        <TextArea
          boxClassName="min-h-48"
          value={notesDraft ?? ""}
          onChange={e => setNotesDraft(e.target.value)}
        />
      </Accordion>
    </>}
  </div>;
};

export default QuestionPage;

import { Dispatch, SetStateAction, FC, useState, useMemo } from "react";
import _ from "lodash";
import { FaStar } from "react-icons/fa";
import { FaMagnifyingGlass } from "react-icons/fa6";
import Dropdown from "../ui/dropdown";
import InputText from "../ui/inputtext";
import { ExamSession, Question } from "@/types/exam";
import Badge from "../ui/badge";

type SearchBoxProps = {
  questions: Question[] | undefined;
  session: ExamSession;
  setSession: Dispatch<SetStateAction<ExamSession>>;
};

type SearchResult = {
  field: "body" | "answerDescription" | "comments";
  position: number[];
  length: number;
};

type SearchOptions = {
  body: boolean;
  answerDescription: boolean;
  comments: boolean;
};

type QuestionItemProps = {
  question: Question & { match: SearchResult; };
  handleClick: (question: Question) => void;
};

const SearchBox: FC<SearchBoxProps> = ({ questions, session, setSession }) => {
  const [searchText, setSearchText] = useState("");
  const [searchOptions, setSearchBy] = useState<SearchOptions>({
    body: true,
    answerDescription: true,
    comments: true,
  });

  const handleClick = (question: Question) => {
    setSession(prev => ({
      ...prev,
      currentQuestion: question,
      pastQuestionUrls: [...prev.pastQuestionUrls, question.url!]
    }));
  };

  const options = useMemo(() => {
    if (!searchText || !questions) return [];
    const search = searchText.toLowerCase();

    let filtered = questions
      ?.map(q => {
        const match = searchFilterFunction(q, search, searchOptions);
        return { ...q, match };
      })
      .filter(q => q.match);

    filtered = _.sortBy(
      filtered,
      o => `${("0000" + o.topic).slice(-4)}-${("0000" + o.index).slice(-4)}`);

    return filtered.map((q, i) => {
      return {
        label: <QuestionItem
          key={i}
          question={q as QuestionItemProps["question"]}
          handleClick={handleClick}
        />,
        value: q.url
      };
    });
  }, [questions, searchText, searchOptions, handleClick]);

  const menuHeader = useMemo(() => {
    return <div className="flex flex-wrap text-xs items-center gap-2">
      <div className="text-xs text-gray-700 mr-auto flex-shrink-0">
        {options.length} question{options.length > 0 ? "s" : ""} found
      </div>
      <div className="flex flex-shrink-0 items-center">
        <div className="mr-2">Search by</div>
        <div className="flex gap-1">
          <Badge
            color={searchOptions.body ? "default" : "dark"}
            className="text-xs font-normal"
            onClick={() => setSearchBy(prev => ({ ...prev, body: !prev.body }))}
          >
            Body
          </Badge>
          <Badge
            color={searchOptions.answerDescription ? "default" : "dark"}
            className="text-xs font-normal"
            onClick={() => setSearchBy(prev => ({ ...prev, answerDescription: !prev.answerDescription }))}
          >
            Answer
          </Badge>
          <Badge
            color={searchOptions.comments ? "default" : "dark"}
            className="text-xs font-normal"
            onClick={() => setSearchBy(prev => ({ ...prev, comments: !prev.comments }))}
          >
            Comments
          </Badge>
        </div>
      </div>
    </div>;
  }, [options]);

  const inputBox = useMemo(() => <InputText
    className="w-full"
    boxClassName="w-full -my-1.5 py-2 font-normal"
    placeholder="Search"
    value={searchText}
    icon={<FaMagnifyingGlass />}
    onChange={e => setSearchText(e.target.value)}
  />, [searchText, setSearchText]);

  return <Dropdown
    options={options}
    value={session.currentQuestion?.url}
    buttonClassName="p-0 border-0 w-full"
    menuClassName="fixed md:absolute left-0 w-full max-h-[50vh] text-left mt-3"
    label={inputBox}
    icon={null}
    toggleMenu={() => true}
    menuHeader={menuHeader}
  />;
};

const searchFilterFunction = (q: Question, text: string, options: SearchOptions): SearchResult | undefined => {
  let match;
  let index;
  if (options.body && q.body) {
    index = q.body.toLowerCase().indexOf(text);
    if (index !== -1) {
      match = {
        field: "body",
        position: [index],
        length: text.length,
      } as SearchResult;
    }
  } else if (options.answerDescription && q.answerDescription) {
    index = q.answerDescription.toLowerCase().indexOf(text);
    if (index !== -1) {
      match = {
        field: "answerDescription",
        position: [index],
        length: text.length,
      } as SearchResult;
    }
  } else if (options.comments && q.comments) {
    for (const ci in q.comments) {
      index = q.comments[ci].content?.toLowerCase().indexOf(text);
      if (index !== -1) {
        match = {
          field: "comments",
          position: [Number(ci), index!],
          length: text.length,
        } as SearchResult;
        break;
      }
    }
  }
  return match;
};

const QuestionItem: FC<QuestionItemProps> = ({ question, handleClick }) => {
  const match = question.match;
  const refText = match.field === "comments" ?
    question.comments[match.position[0]].content : question[match.field];
  const startIndex = match.field === "comments" ? match.position[1] : match.position[0];
  const startTextIndex = startIndex - 50 > 0 ? startIndex - 50 : 0;
  const endIndex = startIndex + match.length;
  const endTextIndex = endIndex + 50 < refText!.length ? startIndex + 50 : refText!.length;

  return <div onClick={() => handleClick(question)}>
    <div className="flex gap-2 items-center text-sm">
      T{question.topic} Q{question.index}
      <Badge className="text-xs font-normal ml-auto">
        {match.field === "comments" ? "Comments" :
          match.field === "answerDescription" ? "Answer" : "Body"}
      </Badge>
      {question.marked && <FaStar className="text-amber-400" size="0.75rem" />}
    </div>
    <div className="text-xs text-gray-500">
      {refText!.slice(startTextIndex, startIndex)}
      <span className="font-bold text-black">
        {refText!.slice(startIndex, endIndex)}
      </span>
      {refText!.slice(endIndex, endTextIndex)}
    </div>
  </div>;
};

export default SearchBox;
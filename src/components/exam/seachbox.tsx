import { Dispatch, SetStateAction, FC, useState, useMemo } from "react";
import _ from "lodash";
import { FaStar } from "react-icons/fa";
import { FaMagnifyingGlass } from "react-icons/fa6";
import Dropdown from "../ui/dropdown";
import InputText from "../ui/inputtext";
import { ExamSession, Question } from "@/types/exam";

type SearchBoxProps = {
  questions: Question[] | undefined;
  session: ExamSession;
  setSession: Dispatch<SetStateAction<ExamSession>>;
};

const SearchBox: FC<SearchBoxProps> = ({ questions, session, setSession }) => {
  const [searchText, setSearchText] = useState("");

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
        const matchIndex = q.body ? q.body.toLowerCase().indexOf(search) : -1;
        return { ...q, matchIndex };
      })
      .filter(q => q.matchIndex !== -1);

    filtered = _.sortBy(
      filtered,
      o => `${("0000" + o.topic).slice(-4)}-${("0000" + o.index).slice(-4)}`);

    return filtered.map((q, i) => {
      const startIndex = q.matchIndex - 50 > 0 ? q.matchIndex - 50 : 0;
      const endMatchIndex = q.matchIndex + searchText.length;
      const endIndex = endMatchIndex + 50 < q.body!.length ? q.matchIndex + 50 : q.body!.length;
      return {
        label: <div key={i} onClick={() => handleClick(q)}>
          <div className="flex gap-2 items-center text-sm">
            T{q.topic} Q{q.index}
            {q.marked && <FaStar className="text-amber-400 ml-auto" size="0.75rem" />}
          </div>
          <div className="text-xs text-gray-500">
            {q.body!.slice(startIndex, q.matchIndex)}
            <span className="font-bold text-black">{q.body!.slice(q.matchIndex, endMatchIndex)}</span>
            {q.body!.slice(endMatchIndex, endIndex)}
          </div>
        </div>,
        value: q.url
      };
    });
  }, [questions, searchText, handleClick]);

  const menuHeader = useMemo(() => {
    return <div className="text-xs text-gray-700">
      {options.length} question{options.length > 0 ? "s" : ""} found
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

export default SearchBox;
import { FC, useContext } from "react";
import { FaStar, FaListOl, FaSortNumericDown, FaRandom } from "react-icons/fa";
import { ExamContext } from "@/context/exam";
import { Question } from "@/types/exam";
import Dropdown from "../ui/dropdown";

type HeaderProps = {
  questions: Question[] | undefined;
};

const Header: FC<HeaderProps> = ({ questions }) => {
  const { examState, examSession, setExamSession } = useContext(ExamContext);
  const currentQuestion = examSession.currentQuestion;

  const handleSelect = <T,>(url?: T) => {
    if (!questions || typeof url !== "string") return;
    const question = questions.find(e => e.url === url);
    if (question) {
      if (currentQuestion?.url) {
        // Store past questions
        setExamSession(prev => {
          return {
            ...prev,
            pastQuestionUrls: [
              ...(prev.pastQuestionUrls ?? []),
              currentQuestion?.url!
            ]
          };
        });
      }
      setExamSession(prev => ({ ...prev, currentQuestion: question }));
    }
  };

  const handleToggleOrder = () => {
    setExamSession(prev => {
      return {
        ...prev,
        order: prev.order === "ascending" ? "random" : "ascending"
      }
    });
  };

  return <div className="flex">
    <div className="flex-1 font-semibold text-lg">
      {examState?.provider?.toUpperCase()} {examState?.examCode?.toUpperCase()}
    </div>
    <Dropdown
      value={currentQuestion?.url}
      onChange={handleSelect}
      options={questions?.map(e => ({
        label: <div className="flex gap-2 items-center">
          {`T${e.topic} Q${e.index}`}
          {e.marked && <FaStar className="text-amber-400 ml-auto" size="0.75rem" />}
        </div>,
        value: e.url,
      }))}
      className="mr-2"
      buttonClassName="button-alt w-10 p-2"
      menuClassName="w-32 max-h-[24rem] overflow-y-auto -ml-10"
      label={null}
      icon={<FaListOl size="1.25rem" className="mx-auto" />}
    />
    <button
      className="button-alt w-10 p-2"
      onClick={handleToggleOrder}
    >
      {examSession.order === "ascending" && <FaSortNumericDown size="1rem" className="mx-auto" />}
      {examSession.order === "random" && <FaRandom size="1rem" className="mx-auto" />}
    </button>
  </div>
};

export default Header;
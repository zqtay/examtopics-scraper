import { FC, useContext } from "react";
import { ExamContext } from "@/context/exam";
import { Question } from "@/types/exam";

type FooterProps = {
  questions?: Question[];
};

const Footer: FC<FooterProps> = ({ questions }) => {
  const { examSession, setExamSession } = useContext(ExamContext);

  const currentQuestion = examSession.currentQuestion;
  const pastQuestionUrls = examSession.pastQuestionUrls;

  const handlePrev = () => {
    if (!questions || pastQuestionUrls.length < 1) return;
    const lastQuestionUrl = pastQuestionUrls[pastQuestionUrls.length - 1];
    const question = questions.find(e => e.url === lastQuestionUrl);
    setExamSession(prev => {
      return {
        ...prev,
        // Remove last
        pastQuestionUrls: prev.pastQuestionUrls.slice(0, prev.pastQuestionUrls.length - 1),
        // Set last as current
        currentQuestion: question,
      };
    });
  };

  const handleNext = () => {
    if (!questions) return;
    let index;
    if (examSession.order === "ascending") {
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
    } else if (examSession.order === "random") {
      index = Math.floor(Math.random() * questions?.length);
    }
    if (index === undefined) return;
    setExamSession(prev => {
      return {
        ...prev,
        currentQuestion: questions[index!],
        // Store past questions
        pastQuestionUrls: [
          ...prev.pastQuestionUrls,
          ...currentQuestion?.url ? [currentQuestion?.url] : [],
        ],
      };
    });
  };

  return <>
    <div id="spacer" className="h-[48px]"></div>
    <div className="fixed w-full bottom-0 left-0 bg-white">
      <div className="container mx-auto p-2">
        <div className="flex justify-center gap-2 w-full max-w-[48rem] mx-auto">
          {examSession?.pastQuestionUrls.length > 0 &&
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
            {examSession?.currentQuestion ? "Next" : "Start"}
          </button>
        </div>
      </div>
    </div>
  </>;
};

export default Footer;
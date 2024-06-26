import { useContext, useEffect, useState } from "react";
import _ from "lodash";
import Header from "@/components/exam/header";
import Footer from "@/components/exam/footer";
import QuestionPage from "@/components/exam/question";
import Upload from "@/components/exam/upload";
import { ExamContext } from "@/context/exam";
import { Question } from "@/types/exam";

const ExamPage = () => {
  const { examState, examSession, setExamSession } = useContext(ExamContext);
  const [questions, setQuestions] = useState<Question[]>();

  const { currentQuestion } = examSession;

  const isLoaded = examState?.provider && examState?.examCode && examState?.questions;

  useEffect(() => {
    // Sort by topic and question index
    const _questions = _.sortBy(
      examState?.questions,
      o => `${("0000" + o.topic).slice(-4)}-${("0000" + o.index).slice(-4)}`);
    setQuestions(_questions);
    if (currentQuestion?.url) {
      setExamSession(prev => ({
        ...prev,
        currentQuestion: _questions.find(e => e.url === currentQuestion.url)
      }));
    }
  }, [examState?.questions]);

  return (
    <div className="h-full max-w-[48rem] mx-auto flex flex-col justify-center">
      {isLoaded ? <Header questions={questions} /> : <Upload />}
      {currentQuestion && <QuestionPage {...currentQuestion} />}
      {isLoaded && <Footer questions={questions} />}
    </div>
  );
};

export default ExamPage;
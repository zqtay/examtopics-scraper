import { useContext, ChangeEvent } from "react";
import classNames from "classnames";
import { FaFileUpload } from "react-icons/fa";
import { ExamContext } from "@/context/exam";
import Dropzone from "../ui/dropzone";

const Upload = () => {
  const { saveExamState, setExamSession } = useContext(ExamContext);

  const handleReadFile = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = (e.target?.result);
      if (typeof text !== "string") return;
      const data = JSON.parse(text);
      saveExamState(data);
      if (data?.questions) {
        // Reset current question
        setExamSession(prev => ({...prev, currentQuestion: undefined}));
      }
    };
    const file = e.target.files?.[0];
    if (file) {
      reader.readAsText(file);
    }
  };

  return <div>
    <Dropzone
      className={classNames("flex-1 mr-2")}
      label={"Import questions data"}
      helperText={"JSON"}
      icon={<FaFileUpload className="size-8 mb-4 text-gray-500 dark:text-gray-400" />}
      accept=".json"
      onChange={handleReadFile}
    />
  </div>;
};

export default Upload;
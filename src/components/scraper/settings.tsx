import { ScraperSettings, SettingsContext } from "@/context/settings";
import { FC, useContext, useEffect, useState } from "react";
import InputText from "../ui/inputtext";
import _ from "lodash";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import Accordion from "../ui/accordion";

type SettingsProps = {
  disabled?: boolean;
};

const Settings: FC<SettingsProps> = ({ disabled }) => {
  const { settings, saveSettings } = useContext(SettingsContext);
  const [draft, setDraft] = useState<ScraperSettings>(settings);

  const handleSave = () => {
    saveSettings(draft);
  };

  useEffect(() => {
    setDraft(settings);
  }, [settings]);

  return <Accordion
    label="Settings"
    collapsed={true}
  >
    <div className="mb-4">
      <div className="mb-2">Fetch question links</div>
      <div className="flex flex-col md:flex-row gap-4 md:gap-2">
        <InputText
          className="flex-1 w-full"
          label="Batch size"
          type="number"
          value={draft.questionLinks.batchSize.toString()}
          onChange={e => setDraft(prev => ({ ...prev, questionLinks: { ...prev.questions, batchSize: parseInt(e.target.value) } }))}
          disabled={disabled}
        />
        <InputText
          className="flex-1 w-full"
          label="Sleep duration between batches"
          type="number"
          value={draft.questionLinks.sleepDuration.toString()}
          onChange={e => setDraft(prev => ({ ...prev, questionLinks: { ...prev.questions, sleepDuration: parseInt(e.target.value) } }))}
          disabled={disabled}
        />
      </div>
    </div>
    <div>
      <div className="mb-2">Fetch questions</div>
      <div className="flex flex-col md:flex-row gap-4 md:gap-2">
        <InputText
          className="flex-1 w-full"
          label="Batch size"
          type="number"
          value={draft.questions.batchSize.toString()}
          onChange={e => setDraft(prev => ({ ...prev, questions: { ...prev.questions, batchSize: parseInt(e.target.value) } }))}
          disabled={disabled}
        />
        <InputText
          className="flex-1 w-full"
          label="Sleep duration between batches"
          type="number"
          value={draft.questions.sleepDuration.toString()}
          onChange={e => setDraft(prev => ({ ...prev, questions: { ...prev.questions, sleepDuration: parseInt(e.target.value) } }))}
          disabled={disabled}
        />
      </div>
    </div>
    <button
      className="button-default mt-4 w-full"
      onClick={handleSave}
      disabled={disabled || _.isEqual(draft, settings)}
    >
      Save
    </button>
  </Accordion>;
};

export default Settings;
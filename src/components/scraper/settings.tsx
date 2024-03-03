import { ScraperSettings, SettingsContext } from "@/context/settings";
import { useContext, useEffect, useState } from "react";
import InputText from "../ui/inputtext";
import _ from "lodash";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";

const Settings = () => {
  const { settings, setSettings } = useContext(SettingsContext);
  const [storedSettings, setStoredSettings] = useState<ScraperSettings>();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const storedValue = localStorage.getItem("settings");
    if (!storedValue) return;
    try {
      const storedSettings = JSON.parse(storedValue);
      setStoredSettings(storedSettings);
    }
    catch (error) {
      // Ignore error, stored value does not exist or invalid
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("settings", JSON.stringify(settings));
    setStoredSettings(settings);
  };

  return <div>
    <div
      className="mb-4 text-lg flex items-center cursor-pointer"
      onClick={() => setVisible(prev => !prev)}
    >
      <span className="flex-1"></span>
      <span>Settings</span>
      <span className="flex-1" >
        {visible ?
          <FaAngleUp className="ml-auto" /> :
          <FaAngleDown className="ml-auto" />
        }
      </span>
    </div>
    {visible === true && <>
      <div className="mb-4">
        <div className="mb-2">Fetch question links</div>
        <div className="flex flex-wrap gap-4">
          <InputText
            className="flex-1 min-w-60"
            label="Batch size"
            type="number"
            value={settings.questionLinks.batchSize.toString()}
            onChange={e => setSettings(prev => ({ ...prev, questionLinks: { ...prev.questionLinks, batchSize: parseInt(e.target.value) } }))}
          />
          <InputText
            className="flex-1 min-w-60"
            label="Sleep duration between batches"
            type="number"
            value={settings.questionLinks.sleepDuration.toString()}
            onChange={e => setSettings(prev => ({ ...prev, questionLinks: { ...prev.questionLinks, sleepDuration: parseInt(e.target.value) } }))}
          />
        </div>
      </div>
      <div>
        <div className="mb-2">Fetch questions</div>
        <div className="flex flex-wrap gap-4">
          <InputText
            className="flex-1 min-w-60"
            label="Batch size"
            type="number"
            value={settings.questions.batchSize.toString()}
            onChange={e => setSettings(prev => ({ ...prev, questions: { ...prev.questions, batchSize: parseInt(e.target.value) } }))}
          />
          <InputText
            className="flex-1 min-w-60"
            label="Sleep duration between batches"
            type="number"
            value={settings.questions.sleepDuration.toString()}
            onChange={e => setSettings(prev => ({ ...prev, questions: { ...prev.questions, sleepDuration: parseInt(e.target.value) } }))}
          />
        </div>
      </div>
      <button
        className="button-default mt-4 w-full"
        onClick={handleSave}
        disabled={_.isEqual(storedSettings, settings)}
      >
        Save
      </button>
    </>}
  </div>;
};

export default Settings;
import { useState, createContext, PropsWithChildren, Dispatch, SetStateAction, useEffect } from 'react';

export const SettingsContext = createContext({} as SettingsContextProps);

export type ScraperSettings = {
  questionLinks: {
    batchSize: number;
    sleepDuration: number;
  };
  questions: {
    batchSize: number;
    sleepDuration: number;
  };
};

export type SettingsContextProps = {
  settings: ScraperSettings,
  setSettings: Dispatch<SetStateAction<ScraperSettings>>
}

export const SettingsProvider = ({ children }: PropsWithChildren) => {
  const [settings, setSettings] = useState<ScraperSettings>({
    questionLinks: {
      batchSize: 10,
      sleepDuration: 0,
    },
    questions: {
      batchSize: 5,
      sleepDuration: 0,
    }
  });

  useEffect(() => {
    const storedValue = localStorage.getItem("settings");
    if (!storedValue) return;
    try {
      const storedSettings = JSON.parse(storedValue);
      setSettings(storedSettings);
    }
    catch (error) {
      // Ignore error, stored value does not exist or invalid
    }
  }, []);

  const value = {
    settings,
    setSettings
  };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};

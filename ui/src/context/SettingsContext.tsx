import React, { useState, PropsWithChildren } from 'react';

export interface Settings {
  lang: 'en' | 'es';
}

export type SettingsContextProps = {
  settings: Settings;
  setLang: (lang: 'en' | 'es') => void;
};

export const SettingsContext = React.createContext<SettingsContextProps>({
  settings: { lang: 'en' },
  setLang: () => {},
});

export const SettingsProvider = ({ children }: PropsWithChildren) => {
  const [settings, setSettings] = useState<Settings>({ lang: 'en' });

  const setLang = (lang: 'en' | 'es') => {
    setSettings((p) => ({ ...p, lang }));
  };

  return <SettingsContext.Provider value={{ settings, setLang }}>{children}</SettingsContext.Provider>;
};

import React, { useState, PropsWithChildren, useContext, useEffect } from 'react';
import NicknameGenerator from '../utils/NicknameGenerator';
import Logger from '../utils/Logger';

export interface Settings {
  nickname: string;
  appearance: {
    fontSize: FontSize;
    glassMode: boolean;
    fontFamily: string;
  };
}

export type FontSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type SettingsContextProps = {
  settings: Settings;
  setNickname: (nickname: string) => void;
  setFontSize: (size: FontSize) => void;
  setGlassMode: (enabled: boolean) => void;
  setFontFamily: (family: string) => void;
};

export const SettingsContext = React.createContext<SettingsContextProps>({
  settings: { nickname: '', appearance: { fontSize: 'md', glassMode: true, fontFamily: '' } },
  setNickname: () => {},
  setFontSize: () => {},
  setGlassMode: () => {},
  setFontFamily: () => {},
});

const getInitialSettings = (): Settings => {
  const settings = localStorage.getItem('settings');
  if (!settings) return { nickname: NicknameGenerator.generate(), appearance: { fontFamily: 'Work Sans', fontSize: 'md', glassMode: true } };
  const parsedSettings = JSON.parse(settings) as Settings;
  return parsedSettings;
};

const loadFontFamily = (family: string) => {
  const sanitizedFont = family.replace(/ /g, '+');
  const id = `dynamically-loaded-font-${sanitizedFont}`;
  if (document.getElementById(id)) {
    Logger.info(`Font ${family} was already imported`);
    document.documentElement.style.setProperty('--font-family', family);
    return; // already included
  }
  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.id = id;
  link.href = `https://fonts.googleapis.com/css2?family=${sanitizedFont}:wght@300;400;700&display=swap`;
  link.onload = () => {
    document.documentElement.style.setProperty('--font-family', family);
  };
  document.getElementsByTagName('head')[0].appendChild(link);
};

export const SettingsProvider = ({ children }: PropsWithChildren) => {
  const [settings, setSettings] = useState<Settings>(getInitialSettings());

  const setNickname = (nickname: string) => {
    setSettings((p) => ({ ...p, nickname }));
  };

  const setFontSize = (size: FontSize) => {
    setSettings((p) => ({ ...p, appearance: { ...p.appearance, fontSize: size } }));
  };
  const setGlassMode = (enabled: boolean) => {
    setSettings((p) => ({ ...p, appearance: { ...p.appearance, glassMode: enabled } }));
  };

  const setFontFamily = (family: string) => {
    loadFontFamily(family);
    setSettings((p) => ({ ...p, appearance: { ...p.appearance, fontFamily: family } }));
  };

  useEffect(() => {
    const items = JSON.stringify(settings);
    localStorage.setItem('settings', items);
  }, [settings]);

  useEffect(() => {
    if (settings.appearance.fontFamily) {
      loadFontFamily(settings.appearance.fontFamily)
    }
  }, []);
  useEffect(() => {
    const { appearance } = settings;
    document.documentElement.setAttribute('data-size', appearance.fontSize ?? 'md');
    document.documentElement.setAttribute('data-glass', `${appearance.glassMode ?? true}`);
  }, [settings.appearance]);

  return <SettingsContext.Provider value={{ settings, setNickname, setFontSize, setGlassMode, setFontFamily }}>{children}</SettingsContext.Provider>;
};

export const useSettingsContext = () => {
  return useContext(SettingsContext);
};

import React, { PropsWithChildren, useState, useCallback, useContext } from 'react';
import backdrops from '../static/backdrops';

interface LayoutContextProps {
  backdrop: boolean;
  toggleBackdrop: (show: boolean) => void;
  pictures?: { dark: string; light: string };
  updatePictures: (picture: LayoutBackdropPicture) => void;
}

const LayoutContext = React.createContext<LayoutContextProps>({
  backdrop: false,
  toggleBackdrop: () => {},
  pictures: backdrops.deviceSelection,
  updatePictures: () => {},
});

export enum LayoutBackdropPicture {
  DEVICE_SELECTION = 'deviceSelection',
  MOBILE_CONNECTION = 'mobileConnection',
  DESKTOP_WELCOME = 'desktopWelcome',
}

const LayoutProvider = ({ children }: PropsWithChildren) => {
  const [backdrop, setBackdrop] = useState(false);
  const [pictures, setPictures] = useState<{ dark: string; light: string }>();

  const toggleBackdrop = useCallback((show: boolean) => {
    setBackdrop(show);
  }, []);

  const updatePictures = useCallback((picture: LayoutBackdropPicture) => {
    setPictures(backdrops[picture]);
  }, []);

  return <LayoutContext.Provider value={{ backdrop, pictures, toggleBackdrop, updatePictures }}>{children}</LayoutContext.Provider>;
};

export const useLayoutContext = () => {
  return useContext(LayoutContext);
};
export default LayoutProvider;

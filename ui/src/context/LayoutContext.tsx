import React, { PropsWithChildren, useState, useCallback, useContext } from 'react';

interface LayoutContextProps {
  backdrop: boolean;
  toggleBackdrop: (show: boolean) => void;
  pictures?: { dark: string; light: string };
  updatePictures: (picture: LayoutBackdropPicture) => void;
}
const BACKDROP_PICTURES = {
  deviceSelection: {
    dark: 'https://images.pexels.com/photos/110854/pexels-photo-110854.jpeg?auto=compress&cs=tinysrgb&w=400',
    light: 'https://images.pexels.com/photos/844297/pexels-photo-844297.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  mobileConnection: {
    dark: 'https://images.pexels.com/photos/2179483/pexels-photo-2179483.jpeg?auto=compress&cs=tinysrgb&w=600',
    light: 'https://i.ytimg.com/vi/XCaTOtyj37k/sddefault.jpg',
  },
  desktopWelcome: {
    dark: 'https://images.pexels.com/photos/5191926/pexels-photo-5191926.jpeg?auto=compress&cs=tinysrgb&w=400',
    light: 'https://img.freepik.com/free-photo/vivid-blurred-colorful-background_58702-2655.jpg',
  },
};

const LayoutContext = React.createContext<LayoutContextProps>({
  backdrop: false,
  toggleBackdrop: () => {},
  pictures: BACKDROP_PICTURES.deviceSelection,
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
    setPictures(BACKDROP_PICTURES[picture]);
  }, []);

  return <LayoutContext.Provider value={{ backdrop, pictures, toggleBackdrop, updatePictures }}>{children}</LayoutContext.Provider>;
};

export const useLayoutContext = () => {
  return useContext(LayoutContext);
};
export default LayoutProvider;

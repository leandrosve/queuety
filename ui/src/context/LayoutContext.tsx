import React, { PropsWithChildren, useState, useCallback, useContext } from 'react';

interface LayoutContextProps {
  backdrop: boolean;
  toggleBackdrop: (show: boolean) => void;
  pictures?: { dark: string; light: string };
  updatePictures: (picture: LayoutBackdropPicture) => void;
}
const BACKDROP_PICTURES = {
  deviceSelection: {
    dark: 'https://images.pexels.com/photos/4220967/pexels-photo-4220967.jpeg?auto=compress&cs=tinysrgb&w=400',
    light: 'https://images.pexels.com/photos/844297/pexels-photo-844297.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  mobileConnection: {
    dark: 'https://images.pexels.com/photos/6307488/pexels-photo-6307488.jpeg?auto=compress&cs=tinysrgb&w=1600',
    light: 'https://i.ytimg.com/vi/XCaTOtyj37k/sddefault.jpg',
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
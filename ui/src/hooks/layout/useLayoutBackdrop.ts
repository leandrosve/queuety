import { LayoutBackdropPicture, useLayoutContext } from '../../context/LayoutContext';
import { useEffect } from 'react';

const useLayoutBackdrop = (show: boolean, picture?: LayoutBackdropPicture) => {
  const { toggleBackdrop, updatePictures } = useLayoutContext();

  useEffect(() => {
    toggleBackdrop(show);
  }, [show]);

  useEffect(() => {
    //Debounce to prevent some images from loading for super low amounts of time
    let timeout = 0;
    if (picture) {
      timeout = setTimeout(() => {
        updatePictures(picture);
      }, 300);
    }
    return () => clearTimeout(timeout);
  }, [picture]);
};

export default useLayoutBackdrop;

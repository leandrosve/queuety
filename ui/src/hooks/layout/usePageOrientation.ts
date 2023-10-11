import { useEffect, useState } from 'react';

const isLandscape = () => window.matchMedia('(orientation: landscape)').matches;

const usePageOrientation = () => {
  const [landscape, setLandscape] = useState(isLandscape());

  useEffect(() => {
    addEventListener('resize', () => {
      setLandscape(isLandscape);
    });
  }, []);

  return {
    landscape: landscape,
    portrait: !landscape,
  };
};

export default usePageOrientation;

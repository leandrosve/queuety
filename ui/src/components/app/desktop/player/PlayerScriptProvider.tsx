import { FunctionComponent, PropsWithChildren, ReactNode, useEffect, useState } from 'react';
import Logger from '../../../../utils/Logger';

const PlayerScriptProvider:FunctionComponent<{ children?: ReactNode; }> = ({ children }: PropsWithChildren) => {
  const [hasLoaded, setHasLoaded] = useState(false);
  const loadIframeAPI = () => {
    if (window.YT) {
      setHasLoaded(true);
      return;
    }
    let tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    let firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
    // @ts-ignore
    window.onYouTubeIframeAPIReady = () => {
      Logger.success('Youtube iframe script succesfully loaded');
      setHasLoaded(true);
    };
  };

  useEffect(loadIframeAPI, []);
  if (!hasLoaded) return;
  return children;
};

export default PlayerScriptProvider;

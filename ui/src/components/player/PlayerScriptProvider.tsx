import { Box } from '@chakra-ui/react';
import { PropsWithChildren, useEffect, useState } from 'react';
import Logger from '../../utils/Logger';

const PlayerScriptProvider = ({ children }: PropsWithChildren) => {
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
  return <Box>{children}</Box>;
};

export default PlayerScriptProvider;

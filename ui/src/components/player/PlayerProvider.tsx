import { Box } from '@chakra-ui/react';
import React, { PropsWithChildren, useEffect, useState } from 'react';

const PlayerProvider = ({ children }: PropsWithChildren) => {
  const [hasLoaded, setHasLoaded] = useState(false);
  const loadIframeAPI = () => {
    let tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    let firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
    // @ts-ignore
    window.onYouTubeIframeAPIReady = () => {
      setHasLoaded(true);
      console.log('Has Loaded');
    };
  };

  useEffect(loadIframeAPI, []);
  if (!hasLoaded) return;
  return <Box>{children}</Box>;
};

export default PlayerProvider;

import React, { useState } from 'react';
import PlayerProvider from '../PlayerProvider';
import Player from '../Player';
import { Flex } from '@chakra-ui/react';
import PlayerSearch from '../search/PlayerSearch';

const PlayerDesktopView = () => {
  const [videoId, setVideoId] = useState<string>('cKlEE_EYuNM');
  return (
    <Flex direction='column' gap={5} paddingTop={10}>
      <PlayerSearch onPlay={(v) => setVideoId(v)} onPlayLast={(v) => setVideoId(v)} onPlayNext={(v) => setVideoId(v)} />
      <PlayerProvider>
        <Player videoId={videoId} />
      </PlayerProvider>
    </Flex>
  );
};

export default PlayerDesktopView;

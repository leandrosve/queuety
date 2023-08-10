import React, { useState } from 'react';
import PlayerScriptProvider from '../PlayerScriptProvider';
import Player from '../Player';
import { Flex } from '@chakra-ui/react';
import PlayerSearch from '../search/PlayerSearch';

const PlayerDesktopView = () => {
  const [videoId, setVideoId] = useState<string>('wiEno0KE5uU');
  return (
    <Flex direction='column' gap={5} paddingTop={10}>
      <PlayerSearch onPlay={(v) => setVideoId(v)} onPlayLast={(v) => setVideoId(v)} onPlayNext={(v) => setVideoId(v)} />
      <PlayerScriptProvider>
        <Player videoId={videoId} />
      </PlayerScriptProvider>
    </Flex>
  );
};

export default PlayerDesktopView;

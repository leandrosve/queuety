import { Children, PropsWithChildren, useState } from 'react';
import PlayerScriptProvider from '../PlayerScriptProvider';
import Player from '../Player';
import { Button, Flex } from '@chakra-ui/react';
import PlayerSearch from '../search/PlayerSearch';
import { PlayerQueueProvider, usePlayerQueueContext } from '../../../context/PlayerQueueContext';
import PlayerQueue from '../queue/PlayerQueue';
import { PlayerStatusProvider } from '../../../context/PlayerStatusContext';

const PlayerDesktopView = () => {
  return (
    <Providers>
      <Content />
    </Providers>
  );
};

const Providers = ({ children }: PropsWithChildren) => (
  <PlayerScriptProvider>
    <PlayerQueueProvider>
      <PlayerStatusProvider>{children}</PlayerStatusProvider>
    </PlayerQueueProvider>
  </PlayerScriptProvider>
);

const Content = () => {
  const {
    currentItem,
    currentIndex,
    queue,
    updateCurrentItem,
    clearQueue,
    addNowToQueue,
    addLastToQueue,
    addNextToQueue,
    updateQueue,
    removeFromQueue,
  } = usePlayerQueueContext();
  return (
    <Flex direction='column' gap={5} paddingTop={10}>
      <PlayerSearch onPlay={addNowToQueue} onPlayLast={addLastToQueue} onPlayNext={addNextToQueue} />
      <PlayerQueue
        currentItem={currentItem}
        currentIndex={currentIndex}
        queue={queue}
        onClear={clearQueue}
        onUpdate={updateQueue}
        onRemove={removeFromQueue}
        onPlay={updateCurrentItem}
      />
      {currentItem ? <Player queueItem={currentItem} /> : <Welcome />}
    </Flex>
  );
};

const Welcome = () => {
  return (
    <Flex direction='column' gap={3} alignItems='center' justifyContent='center' height={500} width={{ base: '95vw', md: 750, lg: 900 }}>
      Welcome!
    </Flex>
  );
};

export default PlayerDesktopView;

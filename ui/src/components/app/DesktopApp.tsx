import { PropsWithChildren } from 'react';
import PlayerScriptProvider from '../player/PlayerScriptProvider';
import Player from '../player/Player';
import { Flex } from '@chakra-ui/react';
import PlayerSearch from '../player/search/PlayerSearch';
import { PlayerQueueProvider, usePlayerQueueContext } from '../../context/PlayerQueueContext';
import PlayerQueue from '../player/queue/PlayerQueue';
import { PlayerStatusProvider } from '../../context/PlayerStatusContext';
import { DesktopConnectionProvider } from '../../context/DesktopConnectionContext';
import Layout from '../layout/Layout';
import DesktopConnectionView from '../connection/desktop/DesktopConnectionView';
import PlayerBackdrop from '../player/PlayerBackdrop';
import AuthorizationRequests from '../connection/desktop/AuthorizationRequests';
import { DesktopAuthProvider } from '../../context/DesktopAuthContext';
import { AuthRequestsProvider } from '../../context/AuthRequestsContext';
import { AllowedUsersProvider } from '../../context/AllowedUsersContext';

const DesktopApp = () => {
  return (
    <Providers>
      <Layout>
        <DesktopConnectionView />
        <Content />
      </Layout>
    </Providers>
  );
};

const Providers = ({ children }: PropsWithChildren) => (
  <DesktopConnectionProvider>
    <AuthRequestsProvider>
      <AllowedUsersProvider>
        <DesktopAuthProvider>
          <PlayerScriptProvider>
            <PlayerQueueProvider>
              <PlayerStatusProvider>{children}</PlayerStatusProvider>
            </PlayerQueueProvider>
          </PlayerScriptProvider>
        </DesktopAuthProvider>
      </AllowedUsersProvider>
    </AuthRequestsProvider>
  </DesktopConnectionProvider>
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
      {!!queue.length && (
        <PlayerQueue
          currentItem={currentItem}
          currentIndex={currentIndex}
          queue={queue}
          onClear={clearQueue}
          onUpdate={updateQueue}
          onRemove={removeFromQueue}
          onPlay={updateCurrentItem}
        />
      )}
      {currentItem ? <Player queueItem={currentItem} /> : <Welcome />}
      <AuthorizationRequests />
    </Flex>
  );
};

const Welcome = () => {
  return (
    <Flex direction='column' gap={3} alignItems='center' justifyContent='center' height={500} width={{ base: '95vw', md: 750, lg: 900 }}>
      Welcome!
      <PlayerBackdrop state={1} image='https://img.freepik.com/free-photo/ultra-detailed-nebula-abstract-wallpaper-4_1562-749.jpg?size=626&ext=jpg' />
    </Flex>
  );
};

export default DesktopApp;

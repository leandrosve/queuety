import { useState } from 'react';
import PlayerScriptProvider from './player/PlayerScriptProvider';
import Player from './player/Player';
import { Flex } from '@chakra-ui/react';
import { PlayerQueueProvider, usePlayerQueueContext } from '../../../context/PlayerQueueContext';
import { PlayerStatusProvider } from '../../../context/PlayerStatusContext';
import { DesktopConnectionProvider } from '../../../context/DesktopConnectionContext';
import { DesktopAuthProvider } from '../../../context/DesktopAuthContext';
import { AuthRequestsProvider } from '../../../context/AuthRequestsContext';
import { AllowedUsersProvider } from '../../../context/AllowedUsersContext';
import { OnlinePrescenceProvider } from '../../../context/OnlinePrescenceContext';
import NavbarDesktop from './layout/NavbarDesktop';
import SettingsModal, { SettingsModalSections } from '../shared/settings/SettingsModal';
import { combineProviders } from '../../../utils/ContextUtils';
import DesktopConnectionView from './connection/DesktopConnectionView';
import DesktopConnectionModal from './connection/DesktopConnectionModal';
import AuthorizationRequests from './connection/AuthorizationRequests';
import PlayerSearch from '../shared/player/search/PlayerSearch';
import PlayerQueue from '../shared/player/queue/PlayerQueue';
import PlayerBackdrop from '../shared/player/PlayerBackdrop';

const MainProviders = combineProviders([
  DesktopConnectionProvider,
  AuthRequestsProvider,
  AllowedUsersProvider,
  OnlinePrescenceProvider,
  DesktopAuthProvider,
]);

const PlayerProviders = combineProviders([PlayerScriptProvider, PlayerQueueProvider, PlayerStatusProvider]);

const DesktopApp = () => {
  const [isConnectionModalOpen, setIsConnectionModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [settingsSection, setSettingsSection] = useState<SettingsModalSections | null>(SettingsModalSections.CONNECTIONS);
  const onDesktopConnectionModalClosed = (redirectToSettigns?: SettingsModalSections) => {
    setIsConnectionModalOpen(false);
    if (redirectToSettigns) {
      setSettingsSection(redirectToSettigns || null);
      setIsSettingsModalOpen(true);
    }
  };
  const onSettingsModalClosed = () => {
    setIsSettingsModalOpen(false);
    setSettingsSection(null);
  };

  return (
    <MainProviders>
      <Flex className='layout' gap={3} grow={1} zIndex={1}>
        <NavbarDesktop onOpenConnectionModal={() => setIsConnectionModalOpen(true)} onOpenSettingsModal={() => setIsSettingsModalOpen(true)} />
        <Flex grow={1} alignItems='start' justifyContent='center'>
          <DesktopConnectionView />
          <DesktopConnectionModal isOpen={isConnectionModalOpen} onClose={onDesktopConnectionModalClosed} />
          <SettingsModal isOpen={isSettingsModalOpen} onClose={onSettingsModalClosed} defaultSection={settingsSection} />
          {!isConnectionModalOpen && <AuthorizationRequests />}
          <PlayerProviders>
            <Content />
          </PlayerProviders>
        </Flex>
      </Flex>
    </MainProviders>
  );
};

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
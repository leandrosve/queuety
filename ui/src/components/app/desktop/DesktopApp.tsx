import { useState } from 'react';
import PlayerScriptProvider from './player/PlayerScriptProvider';
import { Flex } from '@chakra-ui/react';
import { PlayerStatusProvider } from '../../../context/PlayerStatusContext';
import { DesktopConnectionProvider, useDesktopConnectionContext } from '../../../context/DesktopConnectionContext';
import { DesktopAuthProvider } from '../../../context/DesktopAuthContext';
import { AuthRequestsProvider } from '../../../context/AuthRequestsContext';
import { AllowedUsersProvider } from '../../../context/AllowedUsersContext';
import { OnlinePrescenceProvider } from '../../../context/OnlinePrescenceContext';
import NavbarDesktop from './layout/NavbarDesktop';
import SettingsModal, { SettingsModalSections } from '../shared/settings/SettingsModal';
import { combineProviders } from '../../../utils/ContextUtils';
import DesktopConnectionView from './connection/DesktopConnectionView';
import DesktopConnectionModal from './connection/DesktopConnectionModal';
import DesktopAppPlayerView from './DesktopAppPlayerView';
import DesktopNotifications from './notifications.tsx/DesktopNotifications';
import { DesktopNotificationsProvider } from '../../../context/DesktopNotificationsContext';
import useLayoutBackdrop from '../../../hooks/layout/useLayoutBackdrop';
const MainProviders = combineProviders([
  DesktopConnectionProvider,
  AuthRequestsProvider,
  DesktopNotificationsProvider,
  AllowedUsersProvider,
  OnlinePrescenceProvider,
  DesktopAuthProvider,
]);

const PlayerProviders = combineProviders([PlayerScriptProvider, PlayerStatusProvider]);

const DesktopApp = () => {
  const [isConnectionModalOpen, setIsConnectionModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [settingsSection, setSettingsSection] = useState<SettingsModalSections | null>(SettingsModalSections.GENERAL);
  useLayoutBackdrop(false);

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
          <DesktopNotifications hideAuthRequests={isConnectionModalOpen} />
          <PlayerProviders>
            <Content />
          </PlayerProviders>
        </Flex>
      </Flex>
    </MainProviders>
  );
};

const Content = () => {
  const { connection } = useDesktopConnectionContext();
  if (!connection.playerRoom.id || !connection.userId) return null;
  return <DesktopAppPlayerView playerRoomId={connection.playerRoom.id} userId={connection.userId} />;
};

export default DesktopApp;

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
import SettingsModal, { SettingsModalElements, SettingsModalSections } from '../shared/settings/SettingsModal';
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

type ModalOptions = { open: boolean; section?: SettingsModalSections; focusElement?: SettingsModalElements };

const DesktopApp = () => {
  const [isConnectionModalOpen, setIsConnectionModalOpen] = useState(false);

  const [settingsModal, setSettingModal] = useState<ModalOptions>({ open: false });

  const openSettingsModal = (section?: SettingsModalSections, focusElement?: SettingsModalElements) => {
    console.log({ section, focusElement });
    setSettingModal({ open: true, section, focusElement });
  };

  useLayoutBackdrop(false);

  const onDesktopConnectionModalClosed = (section?: SettingsModalSections) => {
    setIsConnectionModalOpen(false);
    if (section) {
      openSettingsModal(section);
    }
  };

  const onSettingsModalClosed = () => {
    setSettingModal({ open: false, section: SettingsModalSections.GENERAL });
  };

  return (
    <MainProviders>
      <Flex className='layout' gap={3} grow={1} zIndex={1}>
        <NavbarDesktop onOpenConnectionModal={() => setIsConnectionModalOpen(true)} onOpenSettingsModal={() => openSettingsModal()} />
        <Flex grow={1} alignItems='start' justifyContent='center'>
          <DesktopConnectionView />
          <DesktopConnectionModal isOpen={isConnectionModalOpen} onClose={onDesktopConnectionModalClosed} />
          <SettingsModal
            isOpen={settingsModal.open}
            onClose={onSettingsModalClosed}
            focusElement={settingsModal.focusElement}
            defaultSection={settingsModal.section}
          />
          <DesktopNotifications hideAuthRequests={isConnectionModalOpen} />
          <PlayerProviders>
            <Content openSettingsModal={openSettingsModal} />
          </PlayerProviders>
        </Flex>
      </Flex>
    </MainProviders>
  );
};

interface ContentProps {
  openSettingsModal: (section?: SettingsModalSections, focusElement?: SettingsModalElements) => void;
}
const Content = ({ openSettingsModal }: ContentProps) => {
  const { connection } = useDesktopConnectionContext();
  if (!connection.playerRoom.id || !connection.userId) return null;
  return <DesktopAppPlayerView onOpenSettingsModal={openSettingsModal} playerRoomId={connection.playerRoom.id} userId={connection.userId} />;
};

export default DesktopApp;

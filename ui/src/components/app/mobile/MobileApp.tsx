import { MobileAuthProvider, useMobileAuthContext } from '../../../context/MobileAuthContext';
import MobileConnectionView from './connection/MobileConnectionView';
import { MobileAuthStatus } from '../../../hooks/connection/useMobileAuth';
import MobileAppView from './MobileAppView';
import { Flex } from '@chakra-ui/react';
import NavbarMobile from './layout/NavbarMobile';
import SettingsModal, { SettingsModalElements, SettingsModalSections } from '../shared/settings/SettingsModal';
import { useState } from 'react';

type ModalOptions = { open: boolean; section?: SettingsModalSections; focusElement?: SettingsModalElements };
const MobileApp = ({ onBack }: { onBack: () => void }) => {
  const [settingsModal, setSettingModal] = useState<ModalOptions>({ open: false });
  const openSettingsModal = (section?: SettingsModalSections, focusElement?: SettingsModalElements) =>
    setSettingModal({ open: true, section, focusElement });
  return (
    <Flex className='layout' grow={1} zIndex={1}>
      <NavbarMobile onOpenSettingsModal={() => setSettingModal({ open: true })} />
      <SettingsModal
        isMobile={true}
        isOpen={settingsModal.open}
        onClose={() => setSettingModal({ open: false })}
        defaultSection={settingsModal.section}
        focusElement={settingsModal.focusElement}
      />
      <MobileAuthProvider>
        <Flex grow={1} alignItems='start' justifyContent='center' flex='1 1 0' position='relative'>
          <Content onOpenSettingsModal={openSettingsModal} onBack={onBack} />
        </Flex>
      </MobileAuthProvider>
    </Flex>
  );
};

interface ContentProps {
  onOpenSettingsModal: (section?: SettingsModalSections, focusElement?: SettingsModalElements) => void;
  onBack: () => void;
}

const Content = ({ onOpenSettingsModal, onBack }: ContentProps) => {
  const { playerRoomId, userId, status, host } = useMobileAuthContext();
  if (!userId) return null;
  if (!playerRoomId || !host) return <MobileConnectionView onOpenSettingsModal={onOpenSettingsModal} onBack={onBack} />;

  return <MobileAppView {...{ playerRoomId, userId, host, joinedRoom: status === MobileAuthStatus.JOINED_PLAYER_ROOM }} />;
};

export default MobileApp;

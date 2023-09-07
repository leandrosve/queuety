import { Flex } from '@chakra-ui/react';
import { PropsWithChildren, useState } from 'react';
import NavbarMobile from '../../app/mobile/layout/NavbarMobile';
import SettingsModal from '../../app/shared/settings/SettingsModal';

interface Props extends PropsWithChildren {
  isMobile?: boolean;
}
const Layout = ({ children }: Props) => {
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  return (
    <Flex className='layout' grow={1} zIndex={1}>
      <NavbarMobile onOpenSettingsModal={() => setIsSettingsModalOpen(true)} />
      <SettingsModal isMobile={true} isOpen={isSettingsModalOpen} onClose={() => setIsSettingsModalOpen(false)} />
      <Flex grow={1} alignItems='start' justifyContent='center' flex='1 1 0' minHeight={0} position='relative'>
        {children}
      </Flex>
    </Flex>
  );
};

export default Layout;

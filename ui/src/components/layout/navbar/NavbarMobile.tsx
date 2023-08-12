import { Button, Flex, Icon, IconButton, Text, useColorMode } from '@chakra-ui/react';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';
import { HiMoon, HiSun } from 'react-icons/hi';
import { LuLanguages } from 'react-icons/lu';
import { TbDeviceMobilePlus } from 'react-icons/tb';
import DesktopConnectionModal from '../../connection/desktop/DesktopConnectionModal';
import { useState } from 'react';

const NavbarMobile = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const currentLanguage = i18next.language;
  const { t } = useTranslation();
  const [isConnectionModalOpen, setIsConnectionModalOpen] = useState(false);

  return (
    <Flex as='header' gap={2} shrink={0} justifyContent='space-between' alignItems='center' padding={2} paddingLeft={4}>
      <Text as='span' color='text.300' fontWeight='bold'>
        Queuety
      </Text>
      <Flex gap={3}>
        <DesktopConnectionModal isOpen={isConnectionModalOpen} onClose={() => setIsConnectionModalOpen(false)} />
        <Button color='text.300' variant='ghost' onClick={() => i18next.changeLanguage(currentLanguage == 'en' ? 'es' : 'en')}>
          {currentLanguage}
        </Button>
        <IconButton
          rounded='full'
          color='text.300'
          variant='ghost'
          icon={<Icon as={colorMode == 'dark' ? HiMoon : HiSun} />}
          aria-label={t('layout.theme.switch')}
          onClick={toggleColorMode}
        />
      </Flex>
    </Flex>
  );
};

export default NavbarMobile;

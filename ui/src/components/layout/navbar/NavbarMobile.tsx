import { Button, Flex, Icon, IconButton, Text, useColorMode } from '@chakra-ui/react';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';
import { HiMoon, HiSun } from 'react-icons/hi';
import { LuLanguages, LuSettings } from 'react-icons/lu';
import { TbDeviceMobilePlus } from 'react-icons/tb';
import DesktopConnectionModal from '../../connection/desktop/DesktopConnectionModal';
import { useState } from 'react';
import SelectMenu from '../../common/SelectMenu';
import languages from '../../../data/languages';
import SettingsModal from '../../settings/SettingsModal';

const NavbarMobile = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { t } = useTranslation();
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  return (
    <Flex as='header' gap={2} shrink={0} justifyContent='space-between' alignItems='center' padding={2} paddingLeft={4}>
      <Text as='span' color='text.300' fontWeight='bold'>
        Queuety
      </Text>
      <Flex gap={3}>
        <SelectMenu
          hideChevron
          hideTriggerValue
          icon={<LuLanguages />}
          value={i18next.language}
          onChange={(v) => i18next.changeLanguage(v)}
          options={languages}
        />
        <IconButton
          rounded='full'
          color='text.300'
          variant='ghost'
          icon={<Icon as={colorMode == 'dark' ? HiMoon : HiSun} />}
          aria-label={t('layout.theme.switch')}
          onClick={toggleColorMode}
        />
        <IconButton
          rounded='full'
          color='text.300'
          variant='ghost'
          icon={<LuSettings />}
          aria-label={'settings'}
          onClick={() => setIsSettingsModalOpen(true)}
        />
        <SettingsModal isMobile={true} isOpen={isSettingsModalOpen} onClose={() => setIsSettingsModalOpen(false)} />
      </Flex>
    </Flex>
  );
};

export default NavbarMobile;

import { Flex, Icon, IconButton, Text, useColorMode } from '@chakra-ui/react';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';
import { HiMoon, HiSun } from 'react-icons/hi';
import { LuLanguages, LuSettings } from 'react-icons/lu';
import SelectMenu from '../../../common/SelectMenu';
import languages from '../../../../data/languages';
import BrandIcon from '../../../../assets/images/BrandIcon';

interface Props {
  onOpenSettingsModal: () => void;
}

const NavbarMobile = ({ onOpenSettingsModal }: Props) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { t } = useTranslation();

  return (
    <Flex as='header' gap={2} shrink={0} justifyContent='space-between' alignItems='center' padding={2} paddingLeft={4}>
      <Text as='span' fontWeight='bold' display='flex' gap={1} title='Queuety'>
        <Icon as={BrandIcon} boxSize='1.5rem' aria-label='Queuety' />
      </Text>
      <Flex gap={3}>
        <SelectMenu
          hideChevron
          hideTriggerValue
          variant='ghost'
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
        <IconButton rounded='full' color='text.300' variant='ghost' icon={<LuSettings />} aria-label={'settings'} onClick={onOpenSettingsModal} />
      </Flex>
    </Flex>
  );
};

export default NavbarMobile;

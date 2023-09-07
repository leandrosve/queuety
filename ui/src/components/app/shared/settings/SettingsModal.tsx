import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  BoxProps,
  Button,
  Flex,
  FormControl,
  FormErrorIcon,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Radio,
  RadioGroup,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Stack,
  Switch,
  Text,
  useColorMode,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { FontSize, useSettingsContext } from '../../../../context/SettingsContext';
import AutoAvatar from '../../../common/AutoAvatar';
import i18next from 'i18next';
import { useMemo, useEffect, useState, useRef } from 'react';
import SelectMenu from '../../../common/SelectMenu';
import GlassModal from '../../../common/glass/GlassModal';
import { LuLanguages, LuLogOut } from 'react-icons/lu';
import { BiText } from 'react-icons/bi';
import fonts from '../../../../data/fonts';
import languages from '../../../../data/languages';
import AllowedUserList from '../../desktop/connection/AllowedUserList';
import PlayerService from '../../../../services/api/player/PlayerService';
import StorageUtils, { StorageKey } from '../../../../utils/StorageUtils';
import MobilePlayerService from '../../../../services/api/player/MobilePlayerService';
import Form from '../../../common/Form';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  isMobile?: boolean;
  defaultSection?: SettingsModalSections | null;
  focusElement?: SettingsModalElements;
}

export enum SettingsModalElements {
  NICKNAME = 'nickname-field',
}

export enum SettingsModalSections {
  GENERAL,
  APPEAREANCE,
  CONNECTIONS,
}

const SettingsModal = ({ isOpen, isMobile, onClose, defaultSection, focusElement }: Props) => {
  const { t } = useTranslation();
  const { colorMode, setColorMode } = useColorMode();
  const { settings, setNickname, setFontSize, setGlassMode, setFontFamily } = useSettingsContext();
  const [nicknameValue, setNicknameValue] = useState(settings.nickname);
  const nicknameError = useMemo(() => !nicknameValue || nicknameValue.length < 3 || nicknameValue.length > 100, [nicknameValue]);
  const nicknameRef = useRef<HTMLInputElement>(null);
  const onSaveNickname = () => {
    if (isMobile && nicknameValue != settings.nickname) {
      MobilePlayerService.notifyUserChanged(nicknameValue);
    }
    setNickname(nicknameValue);
  };

  const onEndSession = () => {
    StorageUtils.clearAll({ exceptions: [StorageKey.SETTINGS, StorageKey.USER_ID] });
    location.reload();
  };
  useEffect(() => {
    setNicknameValue(settings.nickname);
  }, [isOpen]);

  const initialFocusRef = useMemo(() => {
    if (focusElement == SettingsModalElements.NICKNAME) return nicknameRef;
  }, [focusElement]);

  useEffect(() => {
    let timeout: number;
    if (isOpen && focusElement) {
      timeout = setTimeout(() => {
        const element = document.getElementById(focusElement);
        element?.focus();
      }, 200);
    }
    return () => clearTimeout(timeout);
  }, [focusElement, isOpen]);

  return (
    <GlassModal
      isOpen={isOpen}
      onClose={onClose}
      width='500px'
      maxWidth={'95vw'}
      initialFocusRef={initialFocusRef}
      title={
        <Heading size='md' display='flex' gap={2} alignItems='center'>
          {t('settings.settings')}
        </Heading>
      }
      hasCloseButton
    >
      <Box gap={3} paddingTop={0}>
        <Accordion allowToggle defaultIndex={defaultSection ?? 0}>
          <Group title={t('settings.general')} borderTopWidth={0} borderColor='transparent'>
            <Form onSubmit={onSaveNickname}>
              <FormControl isInvalid={nicknameError}>
                <FormLabel mb={0}>{t('settings.displayName.title')}</FormLabel>
                <Text mb={2} fontSize='sm'>
                  {t('settings.displayName.description')}
                </Text>
                <Flex alignItems='center'>
                  <InputGroup>
                    <InputLeftElement>
                      <AutoAvatar size='sm' name={settings.nickname} boxSize='30px' />
                    </InputLeftElement>
                    <Input
                      paddingLeft={'2.5rem'}
                      borderRightRadius={0}
                      borderLeftRadius='40px'
                      placeholder={t('settings.displayName.title')}
                      value={nicknameValue}
                      id={SettingsModalElements.NICKNAME}
                      onChange={(e) => setNicknameValue(e.target.value)}
                    />
                  </InputGroup>
                  <Button
                    isDisabled={nicknameError}
                    borderLeftRadius={0}
                    type='submit'
                    border='1px'
                    borderLeftWidth={0}
                    borderColor='borders.100'
                  >
                    {t('common.save')}
                  </Button>
                </Flex>
                <FormErrorMessage fontSize='xs'>
                  <FormErrorIcon /> {t('settings.displayName.invalid')}
                </FormErrorMessage>
              </FormControl>
            </Form>
            <FormControl>
              <FormLabel>{t('settings.language')}</FormLabel>
              <SelectMenu
                triggerWidth='100%'
                icon={<LuLanguages />}
                value={i18next.language}
                onChange={(v) => i18next.changeLanguage(v)}
                options={languages}
              />
            </FormControl>
            <FormControl>
              <Flex justifyContent='space-between' alignItems='end' gap={2}>
                <Flex direction='column'>
                  <FormLabel mb={0}>{isMobile ? t('settings.session.title') : t('settings.hostSession.title')}</FormLabel>
                  <Text fontSize='sm'>{isMobile ? t('settings.session.description') : t('settings.hostSession.description')}</Text>
                </Flex>
                <Button leftIcon={<LuLogOut />} flexShrink={0} size='sm' onClick={onEndSession}>
                  {isMobile ? t('settings.session.button') : t('settings.hostSession.button')}
                </Button>
              </Flex>
            </FormControl>
          </Group>
          <Group title={t('settings.appearance')} _last={{ borderBottom: 'none' }}>
            <FormControl>
              <FormLabel>{t('settings.fontFamily.title')}</FormLabel>
              <Text mb={2} fontSize='sm'>
                {t('settings.fontFamily.description')}
              </Text>
              <SelectMenu
                icon={<BiText />}
                value={settings.appearance.fontFamily}
                onChange={(v) => setFontFamily(v)}
                options={fonts.map((v) => [v, v])}
                maxHeight={300}
              />
            </FormControl>
            <FormControl paddingRight={2}>
              <FormLabel>{t('settings.fontSize')}</FormLabel>
              <Slider
                onChangeEnd={(v) => {
                  const fontSizes: FontSize[] = ['xs', 'sm', 'md', 'lg', 'xl'];
                  setFontSize(fontSizes[v ?? 2]);
                }}
                aria-label='slider-ex-1'
                colorScheme='primary'
                defaultValue={['xs', 'sm', 'md', 'lg', 'xl'].indexOf(settings.appearance.fontSize)}
                min={0}
                max={4}
                step={1}
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
                <Flex justifyContent='space-between' fontSize='xs' fontWeight='bold' color='text.300' marginBottom='-20px'>
                  {['xs', 'sm', 'md', 'lg', 'xl'].map((v) => (
                    <span key={v}>{t(`settings.fontSizes.${v}`)}</span>
                  ))}
                </Flex>
              </Slider>
            </FormControl>
            <FormControl>
              <FormLabel htmlFor='email-alerts' mb='0'>
                {t('settings.glassTheme.title')}
              </FormLabel>
              <Flex justifyContent='space-between' paddingRight={2} gap={2}>
                <Text fontSize='sm'> {t('settings.glassTheme.description')}</Text>
                <Switch
                  id='glass-mode'
                  isChecked={settings.appearance.glassMode}
                  colorScheme='primary'
                  onChange={(e) => setGlassMode(e.target.checked)}
                />
              </Flex>
            </FormControl>
            <FormControl>
              <FormLabel>{t('settings.colorMode')}</FormLabel>
              <RadioGroup colorScheme='primary' value={colorMode} onChange={(e) => setColorMode(e)}>
                <Stack direction='row' spacing={5}>
                  <Radio value='dark'>{t('settings.colorModes.dark')}</Radio>
                  <Radio value='light'>{t('settings.colorModes.light')}</Radio>
                </Stack>
              </RadioGroup>
            </FormControl>
          </Group>
          {!isMobile && (
            <Group title={t('settings.connections')} borderBottomColor='transparent'>
              <AllowedUserList />
            </Group>
          )}
        </Accordion>
      </Box>
    </GlassModal>
  );
};

interface GroupProps extends BoxProps {
  title: string;
}

const Group = ({ title, children, ...props }: GroupProps) => {
  return (
    <AccordionItem {...props}>
      <AccordionButton paddingLeft={0} paddingRight={2} paddingY={2} borderRadius='md'>
        <Box paddingLeft={1} as='span' flex='1' textAlign='left' fontSize='1.08rem' fontWeight='bold'>
          {title}
        </Box>
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel p={0} pl={3} pb={4}>
        <Stack spacing={2}>{children}</Stack>
      </AccordionPanel>
    </AccordionItem>
  );
};

export default SettingsModal;

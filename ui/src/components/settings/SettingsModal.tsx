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
import { FontSize, useSettingsContext } from '../../context/SettingsContext';
import AutoAvatar from '../common/AutoAvatar';
import i18next from 'i18next';
import { useRef } from 'react';
import SelectMenu from '../common/SelectMenu';
import GlassModal from '../common/glass/GlassModal';
import { LuLanguages } from 'react-icons/lu';
import { BiText } from 'react-icons/bi';
import fonts from '../../data/fonts';
import languages from '../../data/languages';
import AuthorizedDevices from '../connection/desktop/AuthorizedDevices';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  isMobile?: boolean;
}

const SettingsModal = ({ isOpen, isMobile, onClose }: Props) => {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const { colorMode, setColorMode } = useColorMode();

  const { settings, setNickname, setFontSize, setGlassMode, setFontFamily } = useSettingsContext();
  return (
    <GlassModal
      isOpen={isOpen}
      onClose={onClose}
      width='500px'
      maxWidth={'95vw'}
      title={
        <Heading size='md' display='flex' gap={2} alignItems='center'>
          {t('settings.settings')}
        </Heading>
      }
      hasCloseButton
    >
      <Box gap={3} paddingTop={0}>
        <Accordion allowToggle defaultIndex={0}>
          <Group title={t('settings.general')} borderTopWidth={0} borderColor='transparent'>
            <FormControl>
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
                    value={settings.nickname}
                    onChange={(e) => setNickname(e.target.value)}
                  />
                </InputGroup>

                <Button borderLeftRadius={0} border='1px' borderLeftWidth={0} borderColor='borders.100'>
                  {t('common.save')}{' '}
                </Button>
              </Flex>
            </FormControl>
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
          </Group>
          <Group title={t('settings.appearance')} _last={{borderBottom:'none'}}>
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
              <Flex justifyContent='space-between' paddingRight={2}>
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
              <AuthorizedDevices />
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
      <AccordionButton paddingLeft={0} paddingRight={2} paddingY={2}>
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

import { Box, Divider, Flex, Grid, GridItem, Heading, IconButton } from '@chakra-ui/react';
import { Button, Spinner, Stack, Switch, Text } from '@chakra-ui/react';
import { useMemo } from 'react';
import QRCode from 'react-qr-code';
import CopyToClipboard from '../../common/CopyToClipboard';
import { LuEdit, LuLink, LuRefreshCcw, LuSettings } from 'react-icons/lu';
import { useTranslation } from 'react-i18next';
import { useDesktopConnectionContext } from '../../../context/DesktopConnectionContext';
import ConnectionService from '../../../services/api/ConnectionService';
import AutoAvatar from '../../common/AutoAvatar';
import FormatUtils from '../../../utils/FormatUtils';
import { useSettingsContext } from '../../../context/SettingsContext';
import useLayoutBackdrop from '../../../hooks/layout/useLayoutBackdrop';
import { LayoutBackdropPicture } from '../../../context/LayoutContext';
import { SettingsModalElements, SettingsModalSections } from '../shared/settings/SettingsModal';

interface Props {
  onOpenSettingsModal: (section?: SettingsModalSections, focusElement?: SettingsModalElements) => void;
}

const DesktopAppWelcome = ({ onOpenSettingsModal }: Props) => {
  const { t } = useTranslation();
  useLayoutBackdrop(true, LayoutBackdropPicture.DESKTOP_WELCOME);
  const { connection, regenAuthRoom, toggleAutoAuth } = useDesktopConnectionContext();
  const disabled = useMemo(() => !connection.authRoom.id || connection.authRoom.loading, [connection.authRoom]);
  const authRoomLink = useMemo(() => ConnectionService.getLinkForAuthRoomId(connection.authRoom.id || ''), [connection]);
  return (
    <Grid
      templateAreas={{ base: `"start" "qr" "config"`, md: '"start qr""config qr"' }}
      gridTemplateColumns={{ base: '1fr', md: '2fr 2.5fr' }}
      gap={3}
      columnGap={5}
      paddingBottom={3}
    >
      <GridItem area='start' flexGrow={0}>
        <Flex direction='column' gap={2}>
          <Heading size={{ base: 'md', md: 'lg' }}>¡Comencemos!</Heading>
          <Text as='span' fontSize={{ base: 'md', md: 'xl' }}>
            Para conectar un nuevo dispositivo facilmente puedes <b>escanear el código QR</b> desde el dispositivo que quieres conectar.
          </Text>
          <Divider marginY={2} />
          <Text fontSize={{ base: 'md', md: 'xl' }}>
            También puedes comenzar a agregar videos a la cola desde este dispositivo y conectar dispositivos mas tarde. ¡Espero ser de utilidad 😊!
          </Text>
        </Flex>
      </GridItem>
      <GridItem area='config' display='flex' flexDirection='column' justifyContent='end' gap={5} alignItems='stretch'>
        <Stack spacing={2} paddingBottom={0} align='stretch'>
          <Flex alignSelf='start' alignItems='center' justifyContent='center' fontSize='sm' gap={3} marginTop={3}>
            <Text>{t('connection.automaticAuth')}</Text>{' '}
            <Switch colorScheme='primary' isChecked={connection.settings.automatic} onChange={(e) => toggleAutoAuth(e.target.checked)} />
          </Flex>
          <Button
            isDisabled={disabled}
            leftIcon={<LuSettings />}
            onClick={() => onOpenSettingsModal(SettingsModalSections.CONNECTIONS)}
            whiteSpace='normal'
          >
            {t('connection.settingsLink')}
          </Button>
        </Stack>
        <DeviceName onOpenSettingsModal={onOpenSettingsModal} />
      </GridItem>
      <GridItem area='qr'>
        <Flex gap={5} wrap={{ base: 'wrap', lg: 'nowrap' }} margin='auto' justifyContent='center'>
          <Flex padding={3} grow={1} justifyContent='center' maxWidth='60vw' alignItems='center' background={'white'} boxShadow='lg'>
            {disabled ? (
              <Spinner />
            ) : (
              <QRCode style={{ width: '100%', height: '100%' }} value={authRoomLink} viewBox={`0 0 256 256`} level='L' bgColor='#f7f5fe' />
            )}
          </Flex>
          <Flex direction='column' wrap='wrap' grow={{ base: 0, md: 1 }} gap={3}>
            <CopyToClipboard isDisabled={disabled} icon={<LuLink />} value={authRoomLink}>
              {t('connection.copyLink')}
            </CopyToClipboard>
            <CopyToClipboard isDisabled={disabled} value={connection.authRoom.id || ''}>
              {t('connection.copyCode')}
            </CopyToClipboard>
            <Button isDisabled={disabled} leftIcon={<LuRefreshCcw />} onClick={() => regenAuthRoom()}>
              {t('connection.regenCode')}
            </Button>
          </Flex>
        </Flex>
      </GridItem>
    </Grid>
  );
};

const DeviceName = ({ onOpenSettingsModal }: Props) => {
  const { settings } = useSettingsContext();
  const { connection } = useDesktopConnectionContext();
  const { t } = useTranslation();
  return (
    <Flex direction='column' gap={3} width='100%'>
      <Stack width='100%'>
        <Text color='text.300' size='sm'>
          {t('connectionView.deviceName')}
        </Text>
        <Flex
          alignItems='center'
          justifyContent='center'
          gap={3}
          padding={3}
          width='100%'
          boxShadow='xs'
          borderRadius='lg'
          margin='auto'
          background='whiteAlpha.100'
          _light={{ background: 'bg.500' }}
        >
          <Flex alignItems='center' justifyContent='center' gap={3}>
            <AutoAvatar size='sm' name={settings.nickname} boxSize='3em' />
            <Stack align='start' spacing={0}>
              <Text fontWeight='bold' lineHeight='short'>
                {settings.nickname}
              </Text>
              <Text as='span' lineHeight='shorter' fontSize='sm' color='text.300' fontWeight='bold'>
                {FormatUtils.shortenUserId(connection.userId ?? '')}
              </Text>
            </Stack>
          </Flex>
          <IconButton
            icon={<LuEdit />}
            aria-label='edit'
            rounded='full'
            marginLeft='auto'
            onClick={() => onOpenSettingsModal(SettingsModalSections.GENERAL, SettingsModalElements.NICKNAME)}
          />
        </Flex>
      </Stack>
    </Flex>
  );
};

export default DesktopAppWelcome;

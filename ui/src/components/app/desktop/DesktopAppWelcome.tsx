import { Box, Divider, Flex, Grid, GridItem, Heading, Icon, IconButton } from '@chakra-ui/react';
import { Button, Spinner, Stack, Text } from '@chakra-ui/react';
import { useMemo, useState, useCallback } from 'react';
import QRCode from 'react-qr-code';
import CopyToClipboard from '../../common/CopyToClipboard';
import { LuArrowBigLeft, LuLink, LuPencilLine, LuRefreshCcw } from 'react-icons/lu';
import { useTranslation, Trans } from 'react-i18next';
import { useDesktopConnectionContext } from '../../../context/DesktopConnectionContext';
import ConnectionService from '../../../services/api/ConnectionService';
import AutoAvatar from '../../common/AutoAvatar';
import FormatUtils from '../../../utils/FormatUtils';
import { useSettingsContext } from '../../../context/SettingsContext';
import { SettingsModalElements, SettingsModalSections, SettingsModalSetter } from '../shared/settings/SettingsModal';
import DesktopPlayerService from '../../../services/api/player/DesktopPlayerService';
import ConfirmDialog from '../../common/ConfirmDialog';
import { useAllowedUsersContext } from '../../../context/AllowedUsersContext';
import AllowedUserList from './connection/AllowedUserList';
import SearchLinkButton from '../shared/search/SearchLinkButton';

interface Props {
  onOpenSettingsModal: SettingsModalSetter;
  onGoBack: () => void;
  onOpenSearchModal: () => void;
}

const DesktopAppWelcome = ({ onOpenSettingsModal, onGoBack, onOpenSearchModal }: Props) => {
  const { t } = useTranslation();
  const { connection, regenAuthRoom } = useDesktopConnectionContext();
  const [backDialog, setBackDialog] = useState(false);
  const [regenCodeDialog, setRegenCodeDialog] = useState(false);
  const allowedUsers = useAllowedUsersContext();
  const disabled = useMemo(() => !connection.authRoom.id || connection.authRoom.loading, [connection.authRoom]);
  const authRoomLink = useMemo(() => ConnectionService.getLinkForAuthRoomId(connection.authRoom.id || ''), [connection]);

  const handleBack = useCallback(async () => {
    if (!allowedUsers.list?.length) {
      handleBackConfirmation();
    }
    setBackDialog(true);
  }, [allowedUsers]);

  const handleBackConfirmation = async () => {
    try {
      await DesktopPlayerService.sendSessionEnded();
    } finally {
      setBackDialog(false);
      onGoBack();
    }
  };
  return (
    <Flex direction='column' className='section-fade-in'>
      <Button
        variant='link'
        onClick={handleBack}
        size='sm'
        alignSelf='start'
        marginBottom={4}
        color='text.500'
        leftIcon={<Icon as={LuArrowBigLeft} fill='currentcolor' />}
      >
        {t('common.goHome')}
      </Button>
      <SearchLinkButton onClick={onOpenSearchModal} />
      <Grid
        marginTop={5}
        templateAreas={{ base: `"start" "qr" "config"`, md: '"start qr""config qr"' }}
        gridTemplateColumns={{ base: '1fr', md: '2fr 2.5fr' }}
        gap={3}
        columnGap={5}
        paddingBottom={3}
      >
        <GridItem area='start' flexGrow={0}>
          <Flex direction='column' gap={2}>
            <Heading size={{ base: 'md', md: 'lg' }}>{t('receptorWelcome.begin')}</Heading>
            <Text as='span' fontSize={{ base: 'md', md: 'xl' }}>
              <Trans i18nKey={'receptorWelcome.description1'} components={[<b></b>]} />
            </Text>
            <Divider marginY={2} />
            <Text fontSize={{ base: 'md', md: 'xl' }}>{t('receptorWelcome.description2')}</Text>
          </Flex>
        </GridItem>
        <GridItem area='config' display='flex' flexDirection='column' justifyContent='end' gap={5} alignItems='stretch'>
          <Stack border='1px' borderColor='borders.100' padding={3} borderRadius='lg' background='whiteAlpha.100' _light={{ background: 'bg.500' }}>
            <AllowedUserList hideDevicesIfEmpty />
          </Stack>
          <DeviceName onOpenSettingsModal={onOpenSettingsModal} />
        </GridItem>
        <GridItem area='qr'>
          <Flex gap={5} wrap={{ base: 'wrap', lg: 'nowrap' }} margin='auto' justifyContent='center'>
            <Flex
              padding={3}
              grow={1}
              justifyContent='center'
              maxWidth='40vw'
              position='relative'
              alignItems='center'
              background={'#f7f5fe'}
              boxShadow='lg'
            >
              {disabled && (
                <Flex
                  alignItems='center'
                  justifyContent='center'
                  width='100%'
                  height='100%'
                  position='absolute'
                  top={0}
                  left={0}
                  background='#f7f5fe'
                >
                  <Spinner color='black' />
                </Flex>
              )}
              {authRoomLink && (
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
              <Button isDisabled={disabled} leftIcon={<LuRefreshCcw />} onClick={() => setRegenCodeDialog(true)}>
                {t('connection.regenCode')}
              </Button>
            </Flex>
          </Flex>
        </GridItem>
      </Grid>
      <ConfirmDialog
        isOpen={backDialog}
        onCancel={() => setBackDialog(false)}
        onConfirm={handleBackConfirmation}
        title={t('receptorWelcome.backConfirmation.title')}
        description={t('receptorWelcome.backConfirmation.description')}
      />
      <ConfirmDialog
        isOpen={regenCodeDialog}
        onCancel={() => setRegenCodeDialog(false)}
        onConfirm={() => {
          regenAuthRoom();
          setRegenCodeDialog(false);
        }}
        title={t('connection.regenConfirmation.title')}
        description={t('connection.regenConfirmation.description')}
      />
    </Flex>
  );
};

const DeviceName = ({ onOpenSettingsModal }: { onOpenSettingsModal: SettingsModalSetter }) => {
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
            icon={<LuPencilLine />}
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

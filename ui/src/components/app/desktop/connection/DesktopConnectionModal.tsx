import { Box, Button, Flex, Heading, Icon, Spinner, Stack, Switch, Text } from '@chakra-ui/react';
import { useState, useEffect, PropsWithChildren, useCallback, useRef, useMemo } from 'react';
import QRCode from 'react-qr-code';
import CopyToClipboard from '../../../common/CopyToClipboard';
import { LuCheckCircle, LuLink, LuRefreshCcw, LuSettings } from 'react-icons/lu';
import { TbDeviceMobilePlus } from 'react-icons/tb';
import { Trans, useTranslation } from 'react-i18next';
import { useDesktopConnectionContext } from '../../../../context/DesktopConnectionContext';
import GlassModal from '../../../common/glass/GlassModal';
import { useAuthRequestsContext } from '../../../../context/AuthRequestsContext';
import AuthRequest from '../../../../model/auth/AuthRequest';
import AutoAvatar from '../../../common/AutoAvatar';
import { useDesktopAuthContext } from '../../../../context/DesktopAuthContext';
import { AuthResponseStatus } from '../../../../model/auth/AuthResponse';
import FormatUtils from '../../../../utils/FormatUtils';
import { AnimatePresence, motion } from 'framer-motion';
import ConnectionService from '../../../../services/api/ConnectionService';
import { SettingsModalSections } from '../../shared/settings/SettingsModal';
interface Props {
  isOpen: boolean;
  onClose: (redirectToSettigns?: SettingsModalSections) => void;
}
const DesktopConnectionModal = ({ isOpen, onClose }: Props) => {
  const { t } = useTranslation();
  const { list: authRequests } = useAuthRequestsContext();

  const onAccepted = useCallback(() => {
    // when this is called from inside the timeout, it has the old state
    if (authRequests.length <= 1) {
      onClose();
    }
  }, [authRequests]);

  return (
    <GlassModal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <Heading size='md' display='flex' gap={2} alignItems='center'>
          <Icon as={TbDeviceMobilePlus} /> {t('connection.connectDevice')}
        </Heading>
      }
      contentProps={{ minWidth: { base: 300, md: 600 }, maxWidth: { base: '95vw', md: 600 } }}
      hasCloseButton
    >
      <AnimatePresence mode='wait'>
        {!!authRequests.length ? (
          <AuthorizationRequestView
            key={authRequests[authRequests.length - 1].userId}
            onAccepted={onAccepted}
            request={authRequests[authRequests.length - 1]}
          />
        ) : (
          <Transition key='qr-view'>
            <QRView onClose={onClose} />
          </Transition>
        )}
      </AnimatePresence>
    </GlassModal>
  );
};

interface QRViewProps {
  onClose: (redirectToSettigns?: SettingsModalSections) => void;
}
export const QRView = ({ onClose }: QRViewProps) => {
  const { t } = useTranslation();
  const { connection, regenAuthRoom, toggleAutoAuth } = useDesktopConnectionContext();
  const disabled = useMemo(() => !connection.authRoom.id || connection.authRoom.loading, [connection.authRoom]);
  const authRoomLink = useMemo(() => ConnectionService.getLinkForAuthRoomId(connection.authRoom.id || ''), [connection]);
  return (
    <Flex direction='column' alignItems='center' gap={3} justifyContent='center' paddingBottom={5}>
      <Text>{t('connection.connectDescription')}</Text>
      <Stack padding={4} spacing={2} paddingBottom={0}>
        <Flex direction={{ base: 'column', md: 'row' }} gap={5} boxShadow='sm' borderRadius='md'>
          <Flex padding={3} justifyContent='center' alignItems='center' background={'white'} alignSelf='center'>
            {disabled ? <Spinner /> : <QRCode size={224} value={authRoomLink} viewBox={`0 0 256 256`} level='L' bgColor='#f7f5fe' />}
          </Flex>
          <Flex direction='column' gap={3} alignSelf='stretch'>
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
        <Flex alignItems='center' justifyContent='center' fontSize='sm' gap={3} marginTop={3}>
          <Text>{t('connection.automaticAuth')}</Text>{' '}
          <Switch colorScheme='primary' isChecked={connection.settings.automatic} onChange={(e) => toggleAutoAuth(e.target.checked)} />
        </Flex>
        <Button isDisabled={disabled} whiteSpace='break-spaces' leftIcon={<LuSettings />} onClick={() => onClose(SettingsModalSections.CONNECTIONS)}>
          {t('connection.settingsLink')}
        </Button>
      </Stack>
    </Flex>
  );
};

interface AuthorizationRequestViewProps {
  request: AuthRequest;
  onAccepted: () => void;
}

const AuthorizationRequestView = ({ request, onAccepted }: AuthorizationRequestViewProps) => {
  const { authorizeRequest } = useDesktopAuthContext();
  const { toggleAutoAuth, connection } = useDesktopConnectionContext();
  const [autoAuth, setAutoAuth] = useState(connection.settings.automatic);
  const [accepted, setAccepted] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const onAcceptedRef = useRef(onAccepted);
  const { t } = useTranslation();

  const handleAccept = async () => {
    if (isSubmitted) return;
    setIsSubmitted(true);
    setAccepted(true);
    const res = await authorizeRequest(request, AuthResponseStatus.AUTHORIZED);
    toggleAutoAuth(autoAuth);
    if (res) {
      setTimeout(() => {
        onAcceptedRef.current?.();
      }, 800);
    }
  };

  const handleDeny = () => {
    if (isSubmitted) return;
    authorizeRequest(request, AuthResponseStatus.DENIED);
  };

  useEffect(() => {
    onAcceptedRef.current = onAccepted;
  }, [onAccepted]);

  return (
    <Transition key={request.userId} exitDelay={accepted ? 2 : 0}>
      <Stack align='center' spacing={3}>
        <Stack align='center' spacing={1}>
          <AutoAvatar name={request.nickname} size='lg' />
          <Text as='span' color='text.300' fontWeight='bold'>
            {FormatUtils.shortenUserId(request.userId)}
          </Text>
          <Heading size='md'>{request.nickname}</Heading>
        </Stack>
        <Text>
          <Trans i18nKey={'connection.userRequest'} components={[<b></b>]} values={{ nickname: request.nickname }} />
        </Text>
        <Button width='100%' onClick={handleDeny} isDisabled={accepted}>
          {t('connection.reject')}
        </Button>

        <Button
          width='100%'
          colorScheme='primary'
          variant='solid'
          position='relative'
          onClick={handleAccept}
          transition='background 500ms'
          background={accepted ? `primary.500` : undefined}
        >
          <Text as='span' opacity={accepted ? 0 : 1}>
            {t('connection.accept')}
          </Text>
          <Box
            visibility={accepted ? 'visible' : 'hidden'}
            opacity={accepted ? 1 : 0}
            position='absolute'
            display='flex'
            top={0}
            left={'0'}
            height='100%'
            width='100%'
            alignItems='center'
            justifyContent='center'
            color={'white'}
          >
            <Icon as={LuCheckCircle} transition='transform 500ms' transform={accepted ? 'scale(1.5)' : 'scale(1)'} />
          </Box>
        </Button>

        <Flex marginLeft='auto' alignItems='center' fontSize='sm' gap={3}>
          <Text>{t('connection.automaticAuth')}</Text>{' '}
          <Switch isDisabled={isSubmitted} colorScheme='primary' isChecked={autoAuth} onChange={() => setAutoAuth((p) => !p)} />
        </Flex>
      </Stack>
    </Transition>
  );
};

interface TransitionProps extends PropsWithChildren {
  exitDelay?: number;
}

const Transition = ({ children, exitDelay = 0 }: TransitionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { delay: exitDelay } }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
};
export default DesktopConnectionModal;

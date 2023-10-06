import {
  Alert,
  AlertIcon,
  Button,
  CloseButton,
  Flex,
  FormControl,
  FormErrorMessage,
  Heading,
  Icon,
  IconButton,
  Input,
  Spinner,
  Stack,
  Text,
  VisuallyHidden,
} from '@chakra-ui/react';
import { useRef, useEffect, useState, useCallback } from 'react';
import { useMobileAuthContext } from '../../../../context/MobileAuthContext';
import { useSettingsContext } from '../../../../context/SettingsContext';
import AutoAvatar from '../../../common/AutoAvatar';
import FormatUtils from '../../../../utils/FormatUtils';
import { LuArrowBigLeft, LuArrowBigRight, LuPencilLine, LuQrCode } from 'react-icons/lu';
import { AuthError, MobileAuthStatus } from '../../../../hooks/connection/useMobileAuth';
import MobileAuthPendingView from './MobileAuthPendingView';
import AuthUtils from '../../../../utils/AuthUtils';
import { SettingsModalElements, SettingsModalSections } from '../../shared/settings/SettingsModal';
import { BsDot } from 'react-icons/bs';
import useLayoutBackdrop from '../../../../hooks/layout/useLayoutBackdrop';
import { LayoutBackdropPicture } from '../../../../context/LayoutContext';
import { Trans, useTranslation } from 'react-i18next';
import MobileQRScanner from './MobileQRScanner';

interface Props {
  onOpenSettingsModal: (section?: SettingsModalSections, focusElement?: SettingsModalElements) => void;
  onBack: () => void;
}
const MobileConnectionView = ({ onOpenSettingsModal, onBack }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { isSocketReady, onTrigger, userId, status, host, onCancel, rejectionTimeout, error } = useMobileAuthContext();
  const { settings } = useSettingsContext();
  const [authInputError, setAuthInputError] = useState<string | null>(null);
  const [showAuthPendingView, setShowAuthPendingView] = useState(false);
  const [authRoomIdValue, setAuthRoomIdValue] = useState<string>('');
  const [initialized, setInitialized] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  const [authError, setAuthError] = useState(error);

  const { t } = useTranslation();

  useLayoutBackdrop(true, LayoutBackdropPicture.MOBILE_CONNECTION);

  const triggerAuth = useCallback(
    (authRoom?: string) => {
      if (!isSocketReady) {
        alert('socket not ready');
      }
      if (!authRoom || !isSocketReady) return;
      if (!AuthUtils.isValidAuthRoom(authRoom)) {
        setAuthInputError('invalid_code');
        return;
      }
      setShowAuthPendingView(true);
      onTrigger(authRoom);
    },
    [onTrigger]
  );

  const onCancelAuth = async () => {
    await onCancel();
    history.replaceState({}, document.title);
    setShowAuthPendingView(false);
  };

  const onQRScanned = (authCode: string) => {
    triggerAuth(authCode);
    setAuthRoomIdValue(authCode);
    setShowScanner(false);
  };

  useEffect(() => {
    if (!isSocketReady || initialized) return;
    const searchParams = new URLSearchParams(document.location.search);
    let authParam = searchParams.get('auth');
    if (authParam) {
      if (!authParam.startsWith('auth-')) authParam = 'auth-' + authParam;
      triggerAuth(authParam);
      setAuthRoomIdValue(authParam);
    }
    setInitialized(true);
  }, [isSocketReady, initialized]);

  useEffect(() => {
    if (error && [AuthError.AUTH_REVOKED, AuthError.SESSION_ENDED].includes(error)) {
      setAuthError(error);
    } else {
      setAuthError(null);
    }
  }, [error]);

  useEffect(() => {
    if (!authRoomIdValue) {
      setAuthInputError(null);
      return;
    }
    if (!AuthUtils.isValidAuthRoom(authRoomIdValue)) {
      setAuthInputError('invalid_code');
      return;
    }
    setAuthInputError(null);
  }, [authRoomIdValue]);

  return (
    <Flex direction='column' paddingX={4} maxWidth='400px' alignSelf='stretch' className='section-fade-in'>
      <Button
        variant='link'
        onClick={onBack}
        size='sm'
        alignSelf='start'
        marginBottom={2}
        color='text.500'
        leftIcon={<Icon as={LuArrowBigLeft} fill='currentcolor' />}
      >
        {t('common.goHome')}
      </Button>
      {authError && (
        <Alert fontSize='sm' status='error' borderRadius='lg' border='1px' borderColor='borders.100' my={3}>
          <AlertIcon />
          {t(`connectionView.notifications.${authError}`)}
          <CloseButton
            size='sm'
            alignSelf='flex-start'
            marginLeft='auto'
            position='relative'
            right={-1}
            top={-1}
            onClick={() => setAuthError(null)}
          />
        </Alert>
      )}
      <Flex direction='column' gap={3}>
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
                  {FormatUtils.shortenUserId(userId ?? '')}
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
        <Heading size='md' textAlign='start'>
          {t('connectionView.devices.title')}
        </Heading>
        <Text>
          <Trans i18nKey={'connectionView.devices.description'} components={[<b />]} />
        </Text>
        <Button
          leftIcon={<Icon as={LuQrCode} boxSize='2rem' />}
          size='lg'
          width='100%'
          padding={3}
          paddingY={8}
          height='auto'
          border='1px solid'
          borderColor='borders.100'
          onClick={() => setShowScanner(true)}
        >
          {t('connectionView.devices.scanQR')}
        </Button>
        <MobileQRScanner isOpen={showScanner} onClose={() => setShowScanner(false)} onDecode={onQRScanned} />

        <Text>
          <Trans i18nKey={'connectionView.devices.alternative'} components={[<b />]} />
        </Text>
        <FormControl isInvalid={!!authInputError}>
          <Flex alignItems='center' width='100%'>
            <Input
              ref={inputRef}
              value={authRoomIdValue}
              borderRightRadius={0}
              placeholder={t('common.example') + ' auth-e2c862a53b5b10e8d8f8023eba22942f'}
              onChange={(e) => setAuthRoomIdValue(e.target.value)}
            />
            <Button
              onClick={() => triggerAuth(inputRef.current?.value || '')}
              borderLeftRadius={0}
              border='1px'
              borderLeftWidth={0}
              borderColor='borders.100'
              spinner={<Spinner size='sm' speed='2s' />}
              isLoading={[MobileAuthStatus.JOINING_AUTH_ROOM, MobileAuthStatus.AUTH_REQUEST_PENDING].includes(status)}
            >
              <Icon as={LuArrowBigRight} fill='currentcolor' aria-hidden />
              <VisuallyHidden>Ingresar</VisuallyHidden>
            </Button>
          </Flex>
          {authInputError && <FormErrorMessage>{authInputError}</FormErrorMessage>}
        </FormControl>

        <MobileAuthPendingView
          host={host}
          status={status}
          onResend={() => triggerAuth(inputRef.current?.value)}
          onCancel={onCancelAuth}
          isOpen={showAuthPendingView}
          rejectionTimeout={rejectionTimeout}
        />
      </Flex>
      <Flex paddingTop={10} grow={1} alignItems='end' justifyContent='center' alignSelf='stretch' opacity={0.7}>
        <Text fontSize='xs' color='text.300'>
          2023
          <Icon aria-hidden as={BsDot} display='inline' mb='-3px' opacity={0.5} /> Queuety
          <Icon aria-hidden as={BsDot} display='inline' mb='-3px' opacity={0.5} /> LS
        </Text>
      </Flex>
    </Flex>
  );
};

export default MobileConnectionView;

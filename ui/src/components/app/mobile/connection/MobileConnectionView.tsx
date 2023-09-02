import { Button, Flex, Heading, Icon, IconButton, Input, Spinner, Stack, Text, VisuallyHidden, useColorMode, useTheme } from '@chakra-ui/react';
import { useRef, useEffect, useState, useCallback } from 'react';
import { useMobileAuthContext } from '../../../../context/MobileAuthContext';
import { useSettingsContext } from '../../../../context/SettingsContext';
import AutoAvatar from '../../../common/AutoAvatar';
import FormatUtils from '../../../../utils/FormatUtils';
import StorageUtils from '../../../../utils/StorageUtils';
import { LuArrowBigLeft, LuArrowBigRight, LuEdit, LuQrCode } from 'react-icons/lu';
import VisualizerBackdrop from '../visualizer/VisualizerBackdrop';
import { MobileAuthStatus } from '../../../../hooks/connection/useMobileAuth';
import MobileAuthPendingView from './MobileAuthPendingView';
import AuthUtils from '../../../../utils/AuthUtils';

const MobileConnectionView = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { isSocketReady, onTrigger, userId, status, hostStatus, host, authRoomId, onCancel } = useMobileAuthContext();

  const { settings } = useSettingsContext();
  const { colorMode } = useColorMode();

  const [showAuthPendingView, setShowAuthPendingView] = useState(false);

  const triggerAuth = useCallback(
    (authRoom: string) => {
      if (!AuthUtils.isValidAuthRoom(authRoom)) return;
      setShowAuthPendingView(true);
      onTrigger(authRoom);
    },
    [onTrigger]
  );

  const onEndSession = () => {
    StorageUtils.clear();
    location.reload();
  };

  const onCancelAuth = () => {
    onCancel();
    setShowAuthPendingView(false);
  };

  useEffect(() => {
    if (!isSocketReady) return;
    const searchParams = new URLSearchParams(document.location.search);
    let authParam = searchParams.get('auth');
    if (authParam) {
      if (!authParam.startsWith('auth-')) authParam = 'auth-' + authParam;
      triggerAuth(authParam);
    }
  }, [isSocketReady]);

  return (
    <Flex direction='column' paddingX={4} maxWidth='400px'>
      <Button variant='link' size='sm' alignSelf='start' marginBottom={2} leftIcon={<Icon as={LuArrowBigLeft} fill='currentcolor' />}>
        Volver al inicio
      </Button>
      <Flex direction='column' gap={3}>
        <Stack width='100%'>
          <Text color='text.300' size='sm'>
            Tu nombre de dispositivo es:
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
            <IconButton icon={<LuEdit />} aria-label='edit' rounded='full' marginLeft='auto' />
          </Flex>
        </Stack>
        <Heading size='md' textAlign='start'>
          Conectarse al escritorio
        </Heading>
        <Text>
          Puedes escanear el código QR mostrado en la sección <b>Conectar Dispositivo</b> en el escritorio
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
        >
          Escanear QR
        </Button>
        <Text>
          Alternativamente puedes ingresar el <b>código de autorización</b>
        </Text>
        <Flex alignItems='center' width='100%'>
          <Input ref={inputRef} borderRightRadius={0} placeholder='Ej: auth-e2c862a53b5b10e8d8f8023eba22942f' />
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
        {showAuthPendingView && (
          <MobileAuthPendingView host={host} status={status} onResend={() => triggerAuth(authRoomId || '')} onCancel={onCancelAuth} />
        )}
        <Text textAlign='center' paddingTop={5}>
          {status}
        </Text>
        <Heading>{hostStatus}</Heading>
        <Button onClick={onEndSession}>Desconectar</Button>
        <VisualizerBackdrop
          src={
            colorMode == 'dark'
              ? 'https://images.pexels.com/photos/6307488/pexels-photo-6307488.jpeg?auto=compress&cs=tinysrgb&w=1600'
              : 'https://i.ytimg.com/vi/XCaTOtyj37k/sddefault.jpg'
          }
        />
      </Flex>
    </Flex>
  );
};

export default MobileConnectionView;

import { Button, Flex, Heading, Input, Stack, Text } from '@chakra-ui/react';
import { useRef, useEffect } from 'react';
import { useMobileAuthContext } from '../../../../context/MobileAuthContext';
import { useSettingsContext } from '../../../../context/SettingsContext';
import AutoAvatar from '../../../common/AutoAvatar';
import FormatUtils from '../../../../utils/FormatUtils';
import PlayerBackdrop from '../../shared/player/PlayerBackdrop';
import StorageUtils from '../../../../utils/StorageUtils';



const MobileConnectionView = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const auth = useMobileAuthContext();
  const { settings } = useSettingsContext();

  const onEndSession = () => {
    StorageUtils.clear();
    location.reload();
  };

  useEffect(() => {
    if (!auth.isSocketReady) return;
    const searchParams = new URLSearchParams(document.location.search);
    let authParam = searchParams.get('auth');
    if (authParam) {
      if (!authParam.startsWith('auth-')) authParam = 'auth-' + authParam;
      auth.onTrigger(authParam);
    }
  }, [auth.isSocketReady]);

  return (
    <Flex direction='column' gap={3} padding={4} alignItems='center' grow={1} paddingBottom={'150px'} justifyContent='center' alignSelf='stretch'>
      <Stack
        background='whiteAlpha.100'
        padding={3}
        boxShadow='md'
        _light={{ background: 'bg.300' }}
        maxWidth='100vh'
        paddingX='5em'
        borderRadius='lg'
      >
        <Text color='text.300'>Your display name is:</Text>
        <Flex alignItems='center' gap={3}>
          <AutoAvatar size='sm' name={settings.nickname} boxSize='3em' />
          <Stack align='start' spacing={0}>
            <Text fontWeight='bold' lineHeight='short'>
              {settings.nickname}
            </Text>
            <Text as='span' lineHeight='shorter' fontSize='sm' color='text.300' fontWeight='bold'>
              {FormatUtils.shortenUserId(auth.userId ?? '')}
            </Text>
          </Stack>
        </Flex>
      </Stack>
      <Flex alignItems='center'>
        <Input ref={inputRef} borderRightRadius={0} placeholder='code' />
        <Button
          onClick={() => auth.onTrigger(inputRef.current?.value || '')}
          borderLeftRadius={0}
          border='1px'
          borderLeftWidth={0}
          borderColor='borders.100'
        >
          Ingresar
        </Button>
      </Flex>
      <Text textAlign='center' paddingTop={5}>
        {auth.status}
      </Text>
      <Heading>{auth.hostStatus}</Heading>
      <Button onClick={onEndSession}>Desconectar</Button>

      <PlayerBackdrop state={1} image='https://img.freepik.com/free-photo/ultra-detailed-nebula-abstract-wallpaper-4_1562-749.jpg?size=626&ext=jpg' />
    </Flex>
  );
};

export default MobileConnectionView;

import { Button, Flex, Heading, Input, InputGroup, Spinner, Tag, Text } from '@chakra-ui/react';
import { useRef, useState, useEffect, useCallback } from 'react';
import { useMobileAuthContext } from '../../../context/MobileAuthContext';
import { MobileAuthStatus } from '../../../hooks/connection/useMobileAuth';
import PlayerBackdrop from '../../player/PlayerBackdrop';

const MobileConnectionView = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const auth = useMobileAuthContext();

  useEffect(() => {
    if (!auth.isSocketReady) return;
    const searchParams = new URLSearchParams(document.location.search)
    const authParam = searchParams.get("auth");
    console.log({authParam})
    if (authParam) auth.onTrigger(authParam);
  }, [auth.isSocketReady])

  useEffect(() => {
    if (!auth.isSocketReady) return;
    setTimeout(() => {
      //auth.onTrigger('auth-5675552a2d08194386f1fbdf5e65686e');
    }, 3000);
  }, [auth.isSocketReady]);

  return (
    <Flex direction='column' gap={3} padding={4} alignItems='center' grow={1} paddingBottom={'150px'} justifyContent='center' alignSelf='stretch'>
      {auth.status == MobileAuthStatus.CONNECTED_TO_SOCKET && (
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
      )}
      {![MobileAuthStatus.JOINED_PLAYER_ROOM, MobileAuthStatus.AUTH_REQUEST_DENIED].includes(auth.status) && <Spinner size='lg' />}

      {![MobileAuthStatus.AUTH_REQUEST_PENDING, MobileAuthStatus.JOINED_PLAYER_ROOM, MobileAuthStatus.AUTH_REQUEST_DENIED].includes(auth.status) && (
        <Text textAlign='center' paddingTop={5}>
          Connecting to desktop session
        </Text>
      )}

      {auth.status == MobileAuthStatus.AUTH_REQUEST_PENDING && (
        <Text textAlign='center' paddingTop={5}>
          Waiting for confirmation on desktop device
        </Text>
      )}
      {auth.status == MobileAuthStatus.JOINING_PLAYER_ROOM && (
        <Text textAlign='center' paddingTop={5}>
          Joining session
        </Text>
      )}
      {auth.status == MobileAuthStatus.JOINED_PLAYER_ROOM && (
        <Text textAlign='center' paddingTop={5}>
          Joined session
        </Text>
      )}

      {auth.status == MobileAuthStatus.AUTH_REQUEST_DENIED && (
        <Text textAlign='center' paddingTop={5}>
          The desktop player did not authorize you to join the session
        </Text>
      )}
      <PlayerBackdrop state={1} image='https://img.freepik.com/free-photo/ultra-detailed-nebula-abstract-wallpaper-4_1562-749.jpg?size=626&ext=jpg' />
    </Flex>
  );
};

export default MobileConnectionView;

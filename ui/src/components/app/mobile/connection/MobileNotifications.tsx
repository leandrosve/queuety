import React, { useState, useEffect } from 'react';
import { useMobileAuthContext } from '../../../../context/MobileAuthContext';
import { HostStatus } from '../../../../hooks/connection/useMobileAuth';
import { Collapse, Flex, Icon } from '@chakra-ui/react';
import { PiPlugsBold, PiPlugsConnectedBold } from 'react-icons/pi';

interface ConnectionError {
  code: string | null;
  recovered: boolean;
}
const MobileNotifications = () => {
  const { hostStatus, isSocketReady } = useMobileAuthContext();

  const [error, setError] = useState<ConnectionError>({ code: null, recovered: false });
  const [errorDisplay, setErrorDisplay] = useState<ConnectionError>({ code: null, recovered: false });

  useEffect(() => {
    if (!isSocketReady) {
      setError({ code: 'offline', recovered: false });
      return;
    }
    if (hostStatus === HostStatus.DISCONNECTED) {
      setError({ code: 'desktop_offline', recovered: false });
      return;
    }
    setError((prev) => {
      if (!prev.recovered) {
        return { ...prev, recovered: true };
      }
      return { code: null, recovered: false };
    });
  }, [hostStatus, isSocketReady]);

  useEffect(() => {
    let timeout: number;
    let displayTimeout: number;

    if (error.recovered) {
      timeout = setTimeout(() => setError({ code: null, recovered: false }), 1600);
    }
    // This is so the content (color and message does not switch before the exit animation is completed)
    if (error.code) {
      setErrorDisplay(error);
    } else {
      displayTimeout = setTimeout(() => setErrorDisplay({ code: null, recovered: false }), 300);
    }
    return () => {
      clearTimeout(timeout);
      clearTimeout(displayTimeout);
    };
  }, [error]);

  return (
    <Flex
      background={errorDisplay.recovered ? 'green.500' : 'red.400'}
      alignSelf='stretch'
      borderTopRadius='lg'
      paddingX={2}
      justifyContent='center'
      color='white'
      paddingBottom={'10px'}
      marginBottom='-10px'
      zIndex={-1}
      opacity={error.code ? 1 : 0}
      transition='opacity 300ms ease'
      textShadow='0px 0px 5px #ffffff8f'
    >
      <Collapse in={!!error.code}>
        <Flex alignItems='center' textShadow='md' gap={2}>
          <Icon as={errorDisplay.recovered ? PiPlugsConnectedBold : PiPlugsBold} filter='drop-shadow(0px 0px 5px #ffffff8f)' />
          {errorDisplay.code ?? '  '}
        </Flex>
      </Collapse>
    </Flex>
  );
};

export default MobileNotifications;

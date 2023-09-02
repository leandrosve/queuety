import React, { useState, useEffect } from 'react';
import { useMobileAuthContext } from '../../../../context/MobileAuthContext';
import { HostStatus } from '../../../../hooks/connection/useMobileAuth';
import { Button, Collapse, Flex, Icon, Spinner, Stack, chakra, shouldForwardProp } from '@chakra-ui/react';
import { PiPlugsBold, PiPlugsConnectedBold } from 'react-icons/pi';
import { useTranslation } from 'react-i18next';
import { LuLogOut } from 'react-icons/lu';
import { AnimatePresence, isValidMotionProp, motion } from 'framer-motion';
import StorageUtils, { StorageKey } from '../../../../utils/StorageUtils';

interface ConnectionError {
  code: string | null;
  recovered: boolean;
}

const ChakraBox = chakra(motion.div, {
  shouldForwardProp: (prop) => isValidMotionProp(prop) || shouldForwardProp(prop),
});

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
    <AnimatePresence>
      {error.code && (
        <ChakraBox
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          position='absolute'
          height='100%'
          top={0}
          left={0}
          width='100vw'
          display='flex'
          flexDirection='column'
          gap={3}
          alignItems='center'
          justifyContent='center'
          zIndex={20}
          bgGradient='linear-gradient(to-t,blackAlpha.700 95%, transparent)'
          _light={{ bgGradient: 'linear-gradient(to-t, blackAlpha.600 95%, transparent)' }}
        >
          <ErrorDisplay key='error-display' error={errorDisplay} />
        </ChakraBox>
      )}
    </AnimatePresence>
  );
};

const ErrorDisplay = ({ error }: { error: { code: string | null; recovered: boolean } }) => {
  const { t } = useTranslation();
  const onEndSession = () => {
    StorageUtils.clearAll({ exceptions: [StorageKey.SETTINGS, StorageKey.USER_ID] });
    location.reload();
  };
  return (
    <>
      <Flex
        background={error.recovered ? 'green.500' : 'red.400'}
        borderRadius='lg'
        color='white'
        transition='background 800ms ease'
        marginTop='-10rem'
        width={'80vw'}
      >
        <Stack align='center' width='100%' spacing={0} padding={2}>
          <Flex
            fontWeight='bold'
            alignSelf='stretch'
            grow={1}
            justifyContent='center'
            flex={1}
            textAlign='center'
            alignItems='center'
            textShadow='md'
            gap={2}
          >
            <Icon as={error.recovered ? PiPlugsConnectedBold : PiPlugsBold} filter='drop-shadow(0px 0px 5px #ffffff8f)' />
            {error.recovered ? t(`notifications.${error.code}_recovered`) : t(`notifications.${error.code}`)}
          </Flex>
          <Flex alignItems='center' gap={2}>
            <Spinner size='xs' speed='1s' /> {t('notifications.awaiting_reconnection')}
          </Flex>
        </Stack>
      </Flex>

      {!error.recovered && (
        <Button leftIcon={<LuLogOut />} bottom='2rem' variant='solid' backdropFilter='blur(10px)' position='absolute' onClick={onEndSession}>
          {t('notifications.disconnect_device')}
        </Button>
      )}
    </>
  );
};

export default MobileNotifications;

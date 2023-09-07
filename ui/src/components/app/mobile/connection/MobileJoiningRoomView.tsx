import { Button, Collapse, Fade, Flex, Icon, Spinner, Stack, Text, useColorMode } from '@chakra-ui/react';
import HostData from '../../../../model/auth/HostData';
import { useState, useEffect, useMemo } from 'react';
import BrandIcon from '../../../../assets/images/BrandIcon';
import FormatUtils from '../../../../utils/FormatUtils';
import { LuLogOut } from 'react-icons/lu';
import { useTranslation } from 'react-i18next';
import AuthUtils from '../../../../utils/AuthUtils';
import VisualizerBackdrop from '../visualizer/VisualizerBackdrop';
import useLayoutBackdrop from '../../../../hooks/layout/useLayoutBackdrop';

interface Props {
  host: HostData;
}
const MobileJoiningRoomView = ({ host }: Props) => {
  const [hostDisconnected, setHostDisconnected] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const hostColor = useMemo(() => {
    return FormatUtils.getColorForNickname(host.nickname ?? '');
  }, [host.nickname]);

  const { t } = useTranslation();
  useEffect(() => {
    const graceTimeout = setTimeout(() => {
      setShowLoader(true);
    }, 1000);

    const hostTimeout = setTimeout(() => {
      setHostDisconnected(true);
    }, 8000);

    return () => {
      clearTimeout(hostTimeout);
      clearTimeout(graceTimeout);
    };
  }, []);

  return (
    <Flex alignItems='center' gap={5} justifyContent='start' height='100%' width='100vw' paddingTop='6.5rem' direction='column'>
      <Collapse in={hostDisconnected}>
        <Stack padding={5}>
          <Icon as={BrandIcon} boxSize='2rem' />
          <Text>No estamos logrando conectar con el anfitrión, por favor verifica que ambos dispositivos esten conectados a internet</Text>
          <Button leftIcon={<LuLogOut />} variant='solid' onClick={() => AuthUtils.endSession()} boxShadow='md'>
            {t('notifications.disconnect_device')}
          </Button>
        </Stack>
      </Collapse>
      <Fade in={showLoader}>
        <Stack align='center' paddingTop={5}>
          <Text color='text.300' position='relative' fontWeight='bold'>
            Esperando al anfitrión
          </Text>
          <Flex
            alignItems='center'
            gap={2}
            bgGradient={`linear(to-bl, ${hostColor}.500, ${hostColor}.500)`}
            color='white'
            paddingX={2}
            borderRadius='md'
          >
            <Spinner speed='1s' size='sm' />
            <Text>{host.nickname}</Text>
          </Flex>
        </Stack>
      </Fade>
    </Flex>
  );
};

export default MobileJoiningRoomView;

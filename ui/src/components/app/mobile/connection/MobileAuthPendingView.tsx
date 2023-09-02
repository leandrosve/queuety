import { Button, Flex, Icon, Spinner, Stack, Text } from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import HostData from '../../../../model/auth/HostData';
import { MobileAuthStatus } from '../../../../hooks/connection/useMobileAuth';
import GlassModal from '../../../common/glass/GlassModal';
import AutoAvatar from '../../../common/AutoAvatar';
import { LuRotateCw } from 'react-icons/lu';
import BrandIcon from '../../../../assets/images/BrandIcon';

interface Props {
  host: HostData | null;
  status: MobileAuthStatus;
  onResend: () => void;
  onCancel: () => void;
}
const MobileAuthPendingView = ({ host, status, onResend, onCancel }: Props) => {
  const [resendTimeout, setResendTimeout] = useState(0);
  const [notResponded, setNotResponded] = useState<boolean>(false);

  const handleResend = () => {
    setNotResponded(false);
    onResend();
  };

  const showResendButton = useMemo(() => {
    return notResponded || status == MobileAuthStatus.AUTH_REQUEST_DENIED || status == MobileAuthStatus.AUTH_REQUEST_STALED;
  }, [notResponded, status]);

  useEffect(() => {
    if (resendTimeout > 0) {
      setTimeout(() => setResendTimeout((p) => p - 1), 1000);
    }
  }, [resendTimeout]);

  useEffect(() => {
    let notRepondedTimeout: number;
    if (status == MobileAuthStatus.AUTH_REQUEST_DENIED) {
      setResendTimeout(10);
    }
    if (status == MobileAuthStatus.SENT_AUTH_REQUEST) {
      notRepondedTimeout = setTimeout(() => setNotResponded(true), 10000);
    }
    return () => {
      clearTimeout(notRepondedTimeout);
    };
  }, [status]);
  return (
    <GlassModal isOpen onClose={() => {}} isCentered width='95vw' maxWidth='480px'>
      <Flex alignItems='center' justifyContent='center' direction='column' gap={1} paddingY={2}>
        {!host && (
          <BrandIcon
            style={{ width: '2rem', height: '2rem', alignSelf: 'center', marginBottom: '1rem' }}
            background='transparent'
            color='currentcolor'
          />
        )}
        {host && (
          <Stack align='center' spacing={0}>
            <AutoAvatar name={host.nickname} />
            <Text fontSize='sm' fontWeight='bold' color='text.300'>
              {host.userId}
            </Text>
          </Stack>
        )}
        <Text>
          {host && status == MobileAuthStatus.AUTH_REQUEST_PENDING && (
            <>
              <b>{host.nickname}</b> ha recibido tu solicitud
            </>
          )}
          {host && status == MobileAuthStatus.AUTH_REQUEST_DENIED && (
            <>
              <b>{host.nickname}</b> ha rechazado tu solicitud
            </>
          )}
          {host && status == MobileAuthStatus.AUTH_REQUEST_STALED && (
            <>
              <b>{host.nickname}</b> no ha contestado tu solicitud
            </>
          )}
        </Text>
        {!notResponded && status == MobileAuthStatus.SENT_AUTH_REQUEST && (
          <Flex alignItems='center' gap={3}>
            <Spinner size='sm' speed='2s' />
            <Text>Enviando solicitud</Text>
          </Flex>
        )}
        {notResponded && (
          <>
            Parece que nadie ha recibido tu solicitud...
            <br /> Verifica que ambos dispositivos tengan acceso a internet, y el código utilizado esté actualizado.
          </>
        )}
        {status == MobileAuthStatus.AUTH_REQUEST_PENDING && (
          <Flex alignItems='center' gap={3}>
            <Spinner size='sm' speed='2s' />
            <Text>Esperando confirmación</Text>
          </Flex>
        )}
        <Flex justifyContent='space-between' alignSelf='stretch' wrap='wrap' marginTop={3}>
          <Button _last={{ marginX: 'auto' }} size={showResendButton ? 'md' : 'sm'} marginTop={showResendButton ? 0 : '1rem'} onClick={onCancel}>
            Cancelar
          </Button>
          {showResendButton && (
            <Button
              position='relative'
              isLoading={resendTimeout > 0}
              onClick={handleResend}
              spinner={
                <>
                  Reenviar solicitud <Text as='span' width='2.5rem'>{`(${resendTimeout}s)`}</Text>
                </>
              }
              leftIcon={<Icon as={LuRotateCw} transform='rotate(-90deg)' />}
            >
              Reenviar solicitud
            </Button>
          )}
        </Flex>
      </Flex>
    </GlassModal>
  );
};

export default MobileAuthPendingView;

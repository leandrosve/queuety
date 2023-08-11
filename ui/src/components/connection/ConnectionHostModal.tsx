import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import ConnectionService from '../../services/api/ConnectionService';
import CopyToClipboard from '../common/CopyToClipboard';
import { LuRefreshCcw } from 'react-icons/lu';
import { TbDeviceMobilePlus } from 'react-icons/tb';
import { useTranslation } from 'react-i18next';
interface Props {
  isOpen: boolean;
  onClose: () => void;
}
const ConnectionHostModal = ({ isOpen, onClose }: Props) => {
  const [code, setCode] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const { t } = useTranslation();
  const onCopy = () => {};

  const retrieveCode = async (forceRegenerate?: boolean) => {
    if (!forceRegenerate) {
      const localCode = ConnectionService.getLocalCode();
      if (localCode) {
        setCode(localCode);
        setLoading(false);
        return;
      }
    }
    setLoading(true);
    const res = await ConnectionService.getConnectionCode();
    if (res.hasError) {
      setLoading(false);

      return;
    }
    setCode(res.data.code);
    ConnectionService.saveLocalCode(res.data.code);
    setLoading(false);
  };
  useEffect(() => {
    retrieveCode();
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent background='bgAlpha.100' backdropFilter={'blur(5px)'} minWidth={500}>
        <ModalHeader>
          <Heading size='md' display='flex' gap={2} alignItems='center'>
            <Icon as={TbDeviceMobilePlus} /> {t('connection.connectDevice')}
          </Heading>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex direction='column' alignItems='center' gap={3} justifyContent='center' paddingBottom={5}>
            <Text>{t('connection.connectDescription')}</Text>
            <Flex gap={5} background='bg.500' padding={4} boxShadow='sm' borderRadius='md'>
              <Flex boxSize={224} justifyContent='center' alignItems='center'>
                {loading ? <Spinner /> : <QRCode size={224} value={code} viewBox={`0 0 256 256`} level='L' bgColor='#f7f5fe' />}
              </Flex>
              <Flex direction='column' gap={3} alignSelf='stretch'>
                <CopyToClipboard value={code} />
                <IconButton aria-label='redo' icon={<LuRefreshCcw />} onClick={() => retrieveCode(true)}>
                  Regen
                </IconButton>
              </Flex>
            </Flex>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ConnectionHostModal;

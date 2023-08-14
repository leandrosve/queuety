import {
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
import { useState } from 'react';
import QRCode from 'react-qr-code';
import CopyToClipboard from '../../common/CopyToClipboard';
import { LuRefreshCcw } from 'react-icons/lu';
import { TbDeviceMobilePlus } from 'react-icons/tb';
import { useTranslation } from 'react-i18next';
import { useDesktopConnectionContext } from '../../../context/DesktopConnectionContext';
import GlassModal from '../../common/glass/GlassModal';
interface Props {
  isOpen: boolean;
  onClose: () => void;
}
const DesktopConnectionModal = ({ isOpen, onClose }: Props) => {
  const { t } = useTranslation();
  const { connection, regenAuthRoom } = useDesktopConnectionContext();

  return (
    <GlassModal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <Heading size='md' display='flex' gap={2} alignItems='center'>
          <Icon as={TbDeviceMobilePlus} /> {t('connection.connectDevice')}
        </Heading>
      }
      hasCloseButton
    >
      <Flex direction='column' alignItems='center' gap={3} justifyContent='center' paddingBottom={5}>
        <Text>{t('connection.connectDescription')}</Text>
        <Flex gap={5} background='bgAlpha.200' padding={4} boxShadow='sm' borderRadius='md'>
          <Flex boxSize={224} justifyContent='center' alignItems='center'>
            {connection.authRoom.loading ? (
              <Spinner />
            ) : (
              <QRCode size={224} value={connection.authRoom.id || ''} viewBox={`0 0 256 256`} level='L' bgColor='#f7f5fe' />
            )}
          </Flex>
          <Flex direction='column' gap={3} alignSelf='stretch'>
            <CopyToClipboard value={connection.authRoom.id || ''} />
            <IconButton aria-label='redo' icon={<LuRefreshCcw />} onClick={() => regenAuthRoom()}>
              Regen
            </IconButton>
          </Flex>
        </Flex>
      </Flex>
    </GlassModal>
  );
};

export default DesktopConnectionModal;

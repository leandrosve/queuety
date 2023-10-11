import { CloseButton, Flex } from '@chakra-ui/react';
import SearchLinkButton from '../../shared/search/SearchLinkButton';
import GlassContainer from '../../../common/glass/GlassContainer';
import MobileQueueContent, { MobileQueueContentProps } from './MobileQueueContent';
import Drawer from '../../../common/drawer/Drawer';

interface Props extends MobileQueueContentProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSearchModal: () => void;
}

const MobileQueueLandscape = ({ isOpen, onClose, onOpenSearchModal, ...contentProps }: Props) => {
  return (
    <Drawer isOpen={isOpen} onClose={onClose}>
      <Flex width={'45vw'} padding={3} direction='column' maxHeight='100vh'>
        <Flex height='3rem' alignItems='start' gap={4} justifyContent='space-between' paddingBottom={3}>
          <SearchLinkButton flexGrow={1} onClick={onOpenSearchModal} alignSelf='stretch' marginBottom={3} />
          <CloseButton onClick={onClose} />
        </Flex>

        <GlassContainer asBefore />
        <MobileQueueContent {...contentProps} />
      </Flex>
    </Drawer>
  );
};

export default MobileQueueLandscape;

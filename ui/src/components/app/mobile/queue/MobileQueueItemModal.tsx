import { Button, Icon } from '@chakra-ui/react';
import GlassModal from '../../../common/glass/GlassModal';
import QueueItem from '../../../../model/player/QueueItem';
import { PropsWithChildren } from 'react';
import { BsPlayFill } from 'react-icons/bs';
import { LuListEnd, LuListStart, LuTrash2 } from 'react-icons/lu';
import { useTranslation } from 'react-i18next';
import { IconType } from 'react-icons/lib';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  item?: QueueItem | null;
  onRemove: () => void;
  onPlay: () => void;
  onMoveNext: () => void;
  onMoveLast: () => void;
}
const MobileQueueItemModal = ({ isOpen, onClose, onPlay, onRemove, onMoveLast, onMoveNext }: Props) => {
  const { t } = useTranslation();
  const handleAction = (action: 'play' | 'remove' | 'moveLast' | 'moveNext') => {
    const actions = {
      play: onPlay,
      remove: onRemove,
      moveLast: onMoveLast,
      moveNext: onMoveNext,
    };
    actions[action]();
    onClose();
  };
  return (
    <GlassModal isOpen={isOpen} onClose={onClose} isCentered maxWidth={'90vw'} bodyProps={{ padding: 2 }}>
      <Option onClick={() => handleAction('play')} icon={BsPlayFill}>
        {t('playerQueue.playNow')}
      </Option>
      <Option onClick={() => handleAction('moveNext')} icon={LuListStart}>
        {t('playerQueue.moveNext')}
      </Option>
      <Option onClick={() => handleAction('moveLast')} icon={LuListEnd}>
        {t('playerQueue.moveLast')}
      </Option>
      <Option onClick={() => handleAction('remove')} icon={LuTrash2}>
        {t('playerQueue.remove')}
      </Option>
    </GlassModal>
  );
};

interface OptionProps extends PropsWithChildren {
  onClick: () => void;
  icon?: (() => JSX.Element) | IconType;
}
const Option = ({ onClick, icon, children }: OptionProps) => (
  <Button
    fontWeight='normal'
    leftIcon={<Icon as={icon} boxSize={5} />}
    variant='ghost'
    width='100%'
    padding={3}
    paddingX={0}
    justifyContent='start'
    gap={2}
    onClick={onClick}
  >
    {children}
  </Button>
);

export default MobileQueueItemModal;

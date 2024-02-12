import { useState } from 'react';
import { Box, Button, Collapse, Flex, Icon, IconButton, Stack, Switch, Tag, Text } from '@chakra-ui/react';

import './desktopQueue.css';
import { useTranslation } from 'react-i18next';
import { DesktopQueueItem } from './DesktopQueueItem';
import QueueItem from '../../../../model/player/QueueItem';
import DragAndDropList from '../../../common/DragAndDropList';
import ConfirmDialog from '../../../common/ConfirmDialog';

interface Props {
  queue: QueueItem[];
  currentItem?: QueueItem | null;
  onUpdate: (itemId: string, destinationIndex: number) => void;
  onRemove: (id: string) => void;
  onPlay: (item: QueueItem) => void;
  onClear: () => void;
}
const DesktopQueueContent = ({ currentItem, queue, onUpdate, onRemove, onPlay, onClear }: Props) => {
  const [openClearConfirmation, setOpenClearConfirmation] = useState(false);

  const { t } = useTranslation();

  return (
    <Flex direction='column' gap={0} maxHeight={500} overflow='hidden' overflowY='auto' padding={5} paddingTop={0}>
      <DragAndDropList
        items={queue}
        onReorder={(itemId, index) => onUpdate(`${itemId}`, index)}
        renderItem={(i, isDragging) => (
          <DesktopQueueItem
            video={i.video}
            isCurrent={currentItem?.id == i.id}
            isDragging={isDragging}
            onRemove={() => onRemove(i.id)}
            onPlay={() => onPlay(i)}
          />
        )}
      />
      <ConfirmDialog
        isOpen={openClearConfirmation}
        onCancel={() => setOpenClearConfirmation(false)}
        onConfirm={() => {
          onClear();
          setOpenClearConfirmation(false);
        }}
        title={t('playerQueue.clearQueue.title')}
        description={t('playerQueue.clearQueue.description')}
      />
    </Flex>
  );
};

export default DesktopQueueContent;

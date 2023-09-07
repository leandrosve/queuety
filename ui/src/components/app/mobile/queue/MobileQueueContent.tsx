import { Button, Flex, Icon, IconButton, Stack, Text } from '@chakra-ui/react';
import { MobileQueueItem } from './MobileQueueItem';
import './mobileQueue.css';
import { BsSkipEndFill } from 'react-icons/bs';
import QueueItem from '../../../../model/player/QueueItem';
import MobileQueueItemModal from './MobileQueueItemModal';
import { useCallback, useState } from 'react';
import DragAndDropList from '../../../common/DragAndDropList';
import { useTranslation } from 'react-i18next';
import GlassContainer from '../../../common/glass/GlassContainer';
import ConfirmDialog from '../../../common/ConfirmDialog';

export interface MobileQueueContentProps {
  queue: QueueItem[];
  currentItem?: QueueItem | null;
  currentIndex?: number;
  onChangeOrder: (itemId: string, destinationIndex: number) => void;
  onRemove: (id: string) => void;
  onPlay: (item: QueueItem) => void;
  onClear: () => void;
  onSkip: () => void;
}

const MobileQueueContent = ({ queue, currentItem, onClear, onPlay, onRemove, onSkip, onChangeOrder, currentIndex = 0 }: MobileQueueContentProps) => {
  const [selectedItem, setSelectedItem] = useState<QueueItem | null>(null);
  const [openClearConfirmation, setOpenClearConfirmation] = useState(false);
  const { t } = useTranslation();

  const onMoveNext = useCallback(
    (itemId: string, destinationIndex: number) => {
      let itemIndex = queue.findIndex((i) => i.id === itemId);
      if (itemIndex < currentIndex) {
        destinationIndex = destinationIndex - 1;
      }
      onChangeOrder(itemId, destinationIndex);
    },
    [queue, currentIndex]
  );

  return (
    <>
      <GlassContainer asBefore />
      <Flex padding={3} paddingTop={0} gap={2} justifyContent='space-between' width='100%'>
        <Stack spacing={2} minWidth={0} overflow='hidden'>
          <Flex gap={2}>
            {currentIndex + 1 < queue.length ? (
              <Stack spacing={0}>
                <Text fontSize='xs'>{t('playerQueue.next')}: </Text>
                <Text className='m-scroll' noOfLines={1} title={queue[currentIndex + 1].video.title}>
                  {queue[currentIndex + 1].video.title}
                </Text>
              </Stack>
            ) : currentItem ? (
              <Stack spacing={0} flexShrink={0}>
                <Text fontSize='xs'>{t('playerQueue.playing')}:</Text>
                <Text className='m-scroll' noOfLines={1}>
                  {currentItem.video.title}
                </Text>
              </Stack>
            ) : null}
          </Flex>

          {queue.length > 1 && (
            <Flex gap={3}>
              <Text fontSize='sm' color='text.300'>
                {t('playerQueue.queue')}:{' '}
                <Text as='span' letterSpacing={3}>
                  {currentIndex + 1}/{queue.length}
                </Text>
              </Text>
              <Button variant='link' size='sm' onClick={() => setOpenClearConfirmation(true)}>
                {t('playerQueue.clear')}
              </Button>
            </Flex>
          )}
        </Stack>
        {currentIndex + 1 < queue.length && (
          <IconButton variant='ghost' icon={<Icon as={BsSkipEndFill} boxSize='1.5rem' />} aria-label='play next' onClick={onSkip} />
        )}
      </Flex>

      <Stack spacing={1} overflowX='hidden' overflowY='auto' width='100%'>
        <DragAndDropList
          items={queue}
          onReorder={(itemId, index) => onChangeOrder(`${itemId}`, index)}
          renderItem={(q) => (
            <MobileQueueItem
              key={q.id}
              video={q.video}
              isCurrent={q.id == currentItem?.id}
              onPlay={() => onPlay(q)}
              onRemove={() => onRemove(q.id)}
              onOpenOptions={() => setSelectedItem(q)}
            />
          )}
        />
      </Stack>
      <MobileQueueItemModal
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        item={selectedItem}
        onRemove={() => selectedItem && onRemove(selectedItem.id)}
        onPlay={() => selectedItem && onPlay(selectedItem)}
        onMoveNext={() => selectedItem && onMoveNext(selectedItem.id, currentIndex + 1)}
        onMoveLast={() => selectedItem && onChangeOrder(selectedItem.id, queue.length)}
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
    </>
  );
};

export default MobileQueueContent;

import { Button, Flex, Icon, IconButton, Stack, Text } from '@chakra-ui/react';
import GlassContainer from '../../../common/glass/GlassContainer';
import { MobileQueueItem } from './MobileQueueItem';
import './mobileQueue.css';
import { BsSkipEndFill } from 'react-icons/bs';
import QueueItem from '../../../../model/player/QueueItem';
import MobileQueueItemModal from './MobileQueueItemModal';
import { useState } from 'react';
import DragAndDropList from '../../../common/DragAndDropList';
import { useTranslation } from 'react-i18next';

interface Props {
  queue: QueueItem[];
  currentItem?: QueueItem | null;
  currentIndex?: number;

  onChangeOrder: (itemId: string, destinationIndex: number) => void;
  onRemove: (id: string) => void;
  onPlay: (item: QueueItem) => void;
  onClear: () => void;
  onSkip: () => void;
}

const MobileQueue = ({ queue, currentItem, onClear, onPlay, onRemove, onSkip, onChangeOrder, currentIndex = 0 }: Props) => {
  const [selectedItem, setSelectedItem] = useState<QueueItem | null>(null);
  const { t } = useTranslation();

  return (
    <>
      <Flex
        grow={1}
        display='flex'
        flexDirection='column'
        alignSelf='stretch'
        boxShadow='sm'
        marginTop={3}
        padding={0}
        paddingY={2}
        borderTopRadius='xl'
        borderTopWidth='1px'
        borderColor='borders.100'
        position='relative'
        overflow='hidden'
        bottom={0}
        left={0}
      >
        <GlassContainer asBefore />
        <Flex padding={3} gap={2} justifyContent='space-between'>
          <Stack spacing={2}>
            <Flex gap={2}>
              {currentIndex + 1 < queue.length ? (
                <Stack spacing={0}>
                  <Text fontSize='xs'>{t('playerQueue.next')}: </Text>
                  <Text noOfLines={1} title={queue[currentIndex + 1].video.title}>
                    {queue[currentIndex + 1].video.title}
                  </Text>
                </Stack>
              ) : currentItem ? (
                <Stack spacing={0}>
                  <Text fontSize='sm'>{t('playerQueue.playing')}:</Text>
                  <Text noOfLines={1}>{currentItem.video.title}</Text>
                </Stack>
              ) : null}
            </Flex>

            {queue.length > 1 && (
              <Flex gap={3}>
                <Text fontSize='sm' color='text.300'>
                  en cola {`${currentIndex + 1}/${queue.length}`}
                </Text>
                <Button variant='link' size='sm' onClick={onClear}>
                  clear
                </Button>
              </Flex>
            )}
          </Stack>
          {queue.length > 1 && (
            <IconButton variant='ghost' icon={<Icon as={BsSkipEndFill} boxSize='1.5rem' />} aria-label='play next' onClick={onSkip} />
          )}
        </Flex>

        <Stack spacing={1} maxHeight={300} overflowX='hidden' overflowY='auto'>
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
      </Flex>
      <MobileQueueItemModal
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        item={selectedItem}
        onRemove={() => selectedItem && onRemove(selectedItem.id)}
        onPlay={() => selectedItem && onPlay(selectedItem)}
        onMoveNext={() => selectedItem && onChangeOrder(selectedItem.id, currentIndex + 1)}
        onMoveLast={() => selectedItem && onChangeOrder(selectedItem.id, queue.length)}
      />
    </>
  );
};

export default MobileQueue;

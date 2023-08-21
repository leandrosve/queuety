import { Button, Flex, Icon, IconButton, Stack, Text } from '@chakra-ui/react';
import GlassContainer from '../../../common/glass/GlassContainer';
import { MobileQueueItem } from './MobileQueueItem';
import './mobileQueue.css';
import { BsSkipEndFill } from 'react-icons/bs';
import QueueItem from '../../../../model/player/QueueItem';
import MobileQueueItemModal from './MobileQueueItemModal';
import { useState } from 'react';

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
  return (
    <>
      <GlassContainer
        display='flex'
        flexDirection='column'
        alignSelf='stretch'
        flexGrow={0}
        flex={0}
        boxShadow='sm'
        marginTop={3}
        padding={0}
        paddingY={2}
        borderTopRadius='xl'
        borderTopWidth='1px'
        borderColor='borders.100'
        position='relative'
        bottom={0}
        left={0}
      >
        <Flex padding={3} gap={2} justifyContent='space-between'>
          <Stack spacing={2}>
            <Flex gap={2}>
              <Text noOfLines={2}>Playing: {currentItem?.video.title}</Text>
            </Flex>

            <Flex gap={3}>
              <Text fontSize='sm' color='text.300'>
                en cola {`${currentIndex}/${queue.length}`}
              </Text>
              <Button variant='link' size='sm' onClick={onClear}>
                clear
              </Button>
            </Flex>
          </Stack>
          <IconButton variant='ghost' icon={<Icon as={BsSkipEndFill} boxSize='1.5rem' />} aria-label='play next' onClick={onSkip} />
        </Flex>

        <Stack spacing={1} maxHeight={300} overflowX='hidden' overflowY='auto'>
          {queue.map((q) => (
            <MobileQueueItem
              key={q.id}
              video={q.video}
              isCurrent={q.id == currentItem?.id}
              onPlay={() => onPlay(q)}
              onRemove={() => onRemove(q.id)}
              onOpenOptions={() => setSelectedItem(q)}
            />
          ))}
        </Stack>
      </GlassContainer>
      <MobileQueueItemModal
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        item={selectedItem}
        onRemove={() => selectedItem && onRemove(selectedItem.id)}
        onPlay={() => selectedItem && onPlay(selectedItem)}
        onMoveNext={() => selectedItem && onChangeOrder(selectedItem.id, currentIndex +1)}
        onMoveLast={() => selectedItem && onChangeOrder(selectedItem.id, queue.length)}
      />
    </>
  );
};

export default MobileQueue;

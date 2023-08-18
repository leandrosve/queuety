import { useState } from 'react';
import { Box, Button, Collapse, Flex, Icon, IconButton, Text } from '@chakra-ui/react';
import { LuChevronDown, LuChevronUp } from 'react-icons/lu';
import './playerQueue.css';
import { useTranslation } from 'react-i18next';
import { PlayerQueueItem } from './PlayerQueueItem';
import { BsDash } from 'react-icons/bs';
import QueueItem from '../../../../../model/player/QueueItem';
import GlassContainer from '../../../../common/glass/GlassContainer';
import DragAndDropList from '../../../../common/DragAndDropList';

interface Props {
  queue: QueueItem[];
  currentItem?: QueueItem | null;
  currentIndex: number;
  onUpdate: (item: QueueItem[]) => void;
  onRemove: (id: string) => void;
  onPlay: (item: QueueItem) => void;
  onClear: () => void;
}
const PlayerQueue = ({ currentItem, currentIndex, queue, onUpdate, onRemove, onPlay, onClear }: Props) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const { t } = useTranslation();

  return (
    <Flex position='fixed' bottom={0} right={'1rem'} zIndex='var(--z-index-queue)' borderTopRadius='md' overflow='hidden'>
      <GlassContainer asBefore />
      <Flex
        direction='column'
        padding={5}
        width={'500px'}
        maxWidth={'95vw'}
        boxShadow='base'
        userSelect={isExpanded ? 'auto' : 'none'}
        cursor={isExpanded ? 'auto' : 'pointer'}
        onClick={isExpanded ? undefined : () => setIsExpanded(true)}
      >
        <Flex justifyContent='space-between' gap={2}>
          <Flex direction='column' gap={1}>
            {currentItem && (
              <Flex noOfLines={2} title={currentItem.video.title}>
                {t('playerQueue.playing')}: {currentItem.video.title}
              </Flex>
            )}
            <Flex alignItems='center' gap={1}>
              <Text color='text.300' fontSize='sm'>
                {t('playerQueue.queue')}:{' '}
                <Text as='span' letterSpacing={3}>
                  {currentIndex + 1}/{queue.length}
                </Text>
              </Text>

              {isExpanded && queue.length > 1 && (
                <>
                  <Icon as={BsDash} aria-hidden transform={'rotate(90)'} />
                  <Button variant='link' size='sm' onClick={onClear}>
                    {t('playerQueue.clear')}
                  </Button>
                </>
              )}
            </Flex>
          </Flex>
          <IconButton
            rounded='full'
            icon={isExpanded ? <LuChevronDown /> : <LuChevronUp />}
            aria-label='expand/collapse'
            onClick={() => setIsExpanded((p) => !p)}
          />
        </Flex>
        <Collapse in={isExpanded}>
          <Box paddingTop={5}>
            <Flex direction='column' gap={0} maxHeight={300} overflow='hidden' overflowY='auto'>
              <DragAndDropList
                items={queue}
                onReorder={onUpdate}
                renderItem={(i, isDragging) => (
                  <PlayerQueueItem
                    video={i.video}
                    isCurrent={currentItem?.id == i.id}
                    isDragging={isDragging}
                    onRemove={() => onRemove(i.id)}
                    onPlay={() => onPlay(i)}
                  />
                )}
              />
            </Flex>
          </Box>
        </Collapse>
      </Flex>
    </Flex>
  );
};

export default PlayerQueue;

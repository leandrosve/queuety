import { useState } from 'react';
import queueMocks from './queueMocks';
import { Button, Collapse, Flex, Icon, IconButton, Text } from '@chakra-ui/react';
import { LuChevronDown, LuChevronUp } from 'react-icons/lu';
import './playerQueue.css';
import { useTranslation } from 'react-i18next';
import DragAndDropList from '../../common/DragAndDropList';
import { PlayerQueueItem } from './PlayerQueueItem';
import QueueItem from '../../../model/player/QueueItem';
import { BsDash } from 'react-icons/bs';

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
    <Flex
      direction='column'
      position='fixed'
      bottom={0}
      right={'1rem'}
      padding={5}
      borderTopRadius='md'
      overflow='hidden'
      width={'600px'}
      maxWidth={'95vw'}
      boxShadow='base'
      zIndex='var(--z-index-queue)'
      userSelect={isExpanded ? 'auto' : 'none'}
      cursor={isExpanded ? 'auto' : 'pointer'}
      onClick={isExpanded ? undefined : () => setIsExpanded(true)}
      _before={{
        content: '""',
        bg: 'bgAlpha.100',
        backdropFilter: 'blur(5px)',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
      }}
    >
      <Flex justifyContent='space-between' gap={2}>
        <Flex direction='column' gap={1}>
          {currentItem && (
            <Flex>
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
        <Flex direction='column' gap={0} paddingTop={5}>
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
      </Collapse>
    </Flex>
  );
};

export default PlayerQueue;

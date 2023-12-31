import { useState } from 'react';
import { Box, Button, Collapse, Flex, Icon, IconButton, Stack, Switch, Text } from '@chakra-ui/react';
import { LuChevronDown, LuChevronUp } from 'react-icons/lu';
import { ImLoop } from 'react-icons/im';

import './desktopQueue.css';
import { useTranslation } from 'react-i18next';
import { DesktopQueueItem } from './DesktopQueueItem';
import { BsDash } from 'react-icons/bs';
import QueueItem from '../../../../model/player/QueueItem';
import GlassContainer from '../../../common/glass/GlassContainer';
import DragAndDropList from '../../../common/DragAndDropList';
import ConfirmDialog from '../../../common/ConfirmDialog';

interface Props {
  queue: QueueItem[];
  currentItem?: QueueItem | null;
  currentIndex: number;
  loop: boolean;
  onUpdate: (itemId: string, destinationIndex: number) => void;
  onRemove: (id: string) => void;
  onPlay: (item: QueueItem) => void;
  onToggleLoop: (loop: boolean) => void;
  onClear: () => void;
}
const DesktopQueue = ({ currentItem, currentIndex, queue, onUpdate, onRemove, onPlay, onClear, loop, onToggleLoop }: Props) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [openClearConfirmation, setOpenClearConfirmation] = useState(false);

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
        <Flex direction='column' justifyContent='space-between' gap={2}>
          <Flex justifyContent='space-between' gap={2}>
            <Flex direction='column' gap={1} minWidth={0}>
              {currentIndex + 1 < queue.length ? (
                <Stack spacing={0}>
                  <Text fontSize='sm'>{t('playerQueue.next')}: </Text>
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
            <IconButton
              rounded='full'
              icon={isExpanded ? <LuChevronDown /> : <LuChevronUp />}
              aria-label='expand/collapse'
              onClick={() => setIsExpanded((p) => !p)}
            />
          </Flex>
          <Flex alignItems='center' justifyContent='space-between' gap={1}>
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
                  <Button variant='link' size='sm' onClick={() => setOpenClearConfirmation(true)}>
                    {t('playerQueue.clear')}
                  </Button>
                </>
              )}
            </Flex>
            {isExpanded && false && (
              <Flex alignItems='center' gap={2} fontSize='sm' color='text.300'>
                <Icon as={ImLoop} />
                <Text as='span'>{t('playerQueue.loop')}</Text>
                <Switch colorScheme='primary' size='sm' isChecked={loop} onChange={(e) => onToggleLoop(e.target.checked)} />
              </Flex>
            )}
          </Flex>
        </Flex>
        <Collapse in={isExpanded}>
          <Box paddingTop={5}>
            <Flex direction='column' gap={0} maxHeight={300} overflow='hidden' overflowY='auto'>
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
            </Flex>
          </Box>
        </Collapse>
      </Flex>
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

export default DesktopQueue;

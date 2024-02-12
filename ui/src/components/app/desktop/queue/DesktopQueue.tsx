import { useState } from 'react';
import { Box, Button, Collapse, Flex, Icon, IconButton, Stack, Switch, Tag, Text } from '@chakra-ui/react';
import { LuChevronDown, LuChevronLeft, LuChevronUp, LuListVideo } from 'react-icons/lu';
import { ImLoop } from 'react-icons/im';

import './desktopQueue.css';
import { useTranslation } from 'react-i18next';
import { BsDash } from 'react-icons/bs';
import QueueItem from '../../../../model/player/QueueItem';
import GlassContainer from '../../../common/glass/GlassContainer';
import ConfirmDialog from '../../../common/ConfirmDialog';
import DesktopQueueContent from './DesktopQueueContent';
import DesktopPlaylistContent from './DesktopPlaylistContent';
import { YoutubePlaylistItem } from '../../../../services/api/YoutubeService';

interface Props {
  queue: QueueItem[];
  currentItem?: QueueItem | null;
  currentIndex: number;
  currentPlaylistItem?: YoutubePlaylistItem | null;
  loop: boolean;
  onUpdate: (itemId: string, destinationIndex: number) => void;
  onRemove: (id: string) => void;
  onPlay: (item: QueueItem) => void;
  onToggleLoop: (loop: boolean) => void;
  onClear: () => void;
  onPlayPlaylistItem: (item: YoutubePlaylistItem) => void;
}
const DesktopQueue = ({
  currentItem,
  currentPlaylistItem,
  currentIndex,
  queue,
  onUpdate,
  onRemove,
  onPlay,
  onClear,
  loop,
  onToggleLoop,
  onPlayPlaylistItem,
}: Props) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [openClearConfirmation, setOpenClearConfirmation] = useState(false);
  const [isPlaylistExpanded, setIsPlaylistExpanded] = useState<boolean>(false);

  const { t } = useTranslation();

  const handlePlay = (item: QueueItem) => {
    if (item.video.isPlaylist) {
      setIsPlaylistExpanded(true);
    }
    onPlay(item);
  };

  return (
    <Flex position='fixed' bottom={0} right={'1rem'} zIndex='var(--z-index-queue)' borderTopRadius='md' overflow='hidden'>
      <GlassContainer asBefore />
      <Flex
        direction='column'
        padding={0}
        width={'500px'}
        maxWidth={'95vw'}
        boxShadow='base'
        userSelect={isExpanded ? 'auto' : 'none'}
        cursor={isExpanded ? 'auto' : 'pointer'}
        onClick={isExpanded ? undefined : () => setIsExpanded(true)}
      >
        {(!isPlaylistExpanded || !isExpanded) && (
          <Flex direction='column' justifyContent='space-between' gap={2} padding={5}>
            <Flex justifyContent='space-between' gap={2}>
              <Flex direction='column' gap={1} minWidth={0} flexGrow={1}>
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

            {!isPlaylistExpanded && (
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
            )}
          </Flex>
        )}

        <Collapse in={isExpanded}>
          {currentItem?.video.isPlaylist && isPlaylistExpanded ? (
            <DesktopPlaylistContent
              playlistDetail={currentItem.video}
              currentItem={currentPlaylistItem}
              onBackToQueue={() => setIsPlaylistExpanded(false)}
              onCollapse={() => setIsExpanded(false)}
              onPlayItem={onPlayPlaylistItem}
            />
          ) : (
            <DesktopQueueContent
              queue={queue}
              currentItem={currentItem}
              onPlay={handlePlay}
              onClear={onClear}
              onRemove={onRemove}
              onUpdate={onUpdate}
            />
          )}
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

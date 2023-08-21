import { useState, useRef, useEffect } from 'react';
import { Box, Flex, Heading, Icon, IconButton, Image, Menu, MenuButton, MenuItem, MenuList, Spinner, Text } from '@chakra-ui/react';
import { BsDot, BsFillPlayFill } from 'react-icons/bs';
import { LuAlignJustify, LuMoreVertical, LuTrash2 } from 'react-icons/lu';
import './playerQueue.css';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import PlayerQueueItemProgressBar from './PlayerQueueItemProgressBar';
import { YoutubeVideoDetail } from '../../../../../services/api/YoutubeService';
import FormatUtils from '../../../../../utils/FormatUtils';
import { usePlayerStatusContext } from '../../../../../context/PlayerStatusContext';
import PlayerState from '../../../../../model/player/PlayerState';

interface Props {
  video: YoutubeVideoDetail;
  isPlaying?: boolean;
  isDragging?: boolean;
  isCurrent?: boolean;
  onRemove: () => void;
  onPlay: () => void;
}
export const PlayerQueueItem = ({ video, isPlaying, isCurrent, isDragging, onRemove, onPlay }: Props) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  useEffect(() => {
    if (isCurrent) {
      ref.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isCurrent]);
  return (
    <Flex
      className={classNames('player-queue-item', { 'menu-open': isMenuOpen, 'is-dragging': isDragging })}
      cursor='pointer'
      userSelect='none'
      ref={ref}
      gap={2}
      borderRadius='sm'
      background={isCurrent ? 'whiteAlpha.100' : undefined}
      _light={{ background: isCurrent ? 'blackAlpha.200' : undefined }}
      onClick={onPlay}
      padding={1}
      direction={{ base: 'column', md: 'row' }}
      alignItems='start'
      position='relative'
      height={'80px' /* Must be hardcoded so the d&d placeholder does not mess up*/}
    >
      <Box position='relative' flexShrink={0}>
        <Image width='120px' objectFit='cover' borderRadius='sm' aspectRatio={'16/9'} src={video.thumbnail} />
        {isPlaying && (
          <Icon as={BsFillPlayFill} borderRadius='full' paddingX={1} position='absolute' bottom='.2rem' left='.2rem' background='bgAlpha.100' />
        )}
        <Text as='span' fontSize='sm' paddingX={1} position='absolute' borderRadius='md' bottom='.2rem' right='.2rem' background='bgAlpha.100'>
          {FormatUtils.formatDuration(video.duration)}
        </Text>
        {isCurrent && <PlayerQueueItemProgressBar duration={video.duration} />}
        {isCurrent && <StateIndicator />}
      </Box>
      <Flex direction='column' gap={1}>
        <Heading display='inline' size='sm' noOfLines={1} title={video.title}>
          {video.title}
        </Heading>
        <Flex alignItems='center' gap={2}>
          <Image borderRadius='full' width='25px' objectFit='cover' aspectRatio={'1/1'} src={video.channelThumbnail} />
          <Text as='span' fontWeight='bold' fontSize='sm' noOfLines={1}>
            {video.channelTitle}
          </Text>
        </Flex>
        <Flex alignItems='center' gap={1} wrap='wrap' fontSize='xs' color='text.300'>
          <Text as='span' flexShrink={0}>
            {FormatUtils.shortenNumber(video.viewCount)} views
          </Text>

          <Text as='span' display='inline-flex' alignItems='center'>
            <Icon aria-hidden as={BsDot} display='inline' width={3} height={3} mb='-3px' />
            {FormatUtils.timeAgo(new Date(video.publishedAt))}
          </Text>
        </Flex>
      </Flex>
      <Box
        position='absolute'
        display='flex'
        alignItems='center'
        className={classNames('player-queue-drag')}
        justifyContent='end'
        right={0}
        top={0}
        bgGradient='linear(to-l, bg.400,bg.400, transparent)'
        height={'100%'}
        width={'130px'}
      >
        <Menu
          strategy='fixed'
          placement='left-start'
          isLazy
          autoSelect={false}
          onOpen={() => setIsMenuOpen(true)}
          onClose={() => setIsMenuOpen(false)}
        >
          <MenuButton
            as={IconButton}
            rounded='full'
            color='text.600'
            variant='ghost'
            aria-label='drag'
            padding={3}
            onClick={(e) => e.stopPropagation()}
            icon={<Icon as={LuMoreVertical} />}
          />
          <MenuList onClick={(e) => e.stopPropagation()}>
            <MenuItem icon={<Icon as={BsFillPlayFill} boxSize={4} />} onClick={onPlay}>
              {t('playerQueue.playNow')}
            </MenuItem>
            <MenuItem icon={<Icon as={LuTrash2} boxSize={4} />} onClick={onRemove} isDisabled={isCurrent}>
              {t('playerQueue.remove')}
            </MenuItem>
          </MenuList>
        </Menu>
        <IconButton color='text.600' variant='link' aria-label='drag' padding={3}>
          <Icon as={LuAlignJustify} />
        </IconButton>
      </Box>
    </Flex>
  );
};

const StateIndicator = () => {
  const { status } = usePlayerStatusContext();

  if (status.state == PlayerState.BUFFERING) {
    return (
      <Flex height='100%' width='100%' position='absolute' top='0' left='0' pointerEvents='none' alignItems='center' justifyContent='center'>
        <Spinner />
      </Flex>
    );
  }
  return null;
};

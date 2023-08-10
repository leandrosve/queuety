import { useState } from 'react';
import queueMocks from './queueMocks';
import { Box, Collapse, Flex, Heading, Icon, IconButton, Image, Menu, MenuButton, MenuItem, MenuList, Text } from '@chakra-ui/react';
import FormatUtils from '../../../utils/FormatUtils';
import { BsDot, BsFillPlayFill } from 'react-icons/bs';
import { YoutubeVideoDetail } from '../../../services/api/YoutubeService';
import { LuAlignJustify, LuChevronDown, LuChevronUp, LuMoreVertical, LuTrash2 } from 'react-icons/lu';
import './playerQueue.css';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import DragAndDropList from '../../common/DragAndDropList';

const PlayerQueue = () => {
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
      <Flex justifyContent='space-between'>
        <Flex direction='column' gap={1}>
          <Flex>
            {t('playerQueue.next')}: {queueMocks[1].title}
          </Flex>
          <Flex alignItems='center'>
            <Text color='text.300' fontSize='sm'>
              {t('playerQueue.queue')}:{' '}
              <Text as='span' letterSpacing={3}>
                1/{queueMocks.length}
              </Text>
            </Text>
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
          <DragAndDropList items={queueMocks} renderItem={(i, isDragging) => <PlayerQueueItem video={i} isDragging={isDragging} />}/>
        </Flex>
      </Collapse>
    </Flex>
  );
};

export const PlayerQueueItem = ({ video, isPlaying, isDragging }: { video: YoutubeVideoDetail; isPlaying?: boolean; isDragging?: boolean }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation();
  return (
    <Flex
      className={classNames('player-queue-item', { 'menu-open': isMenuOpen, 'is-dragging': isDragging })}
      cursor='pointer'
      userSelect='none'
      gap={2}
      borderRadius='sm'
      padding={1}
      direction={{ base: 'column', md: 'row' }}
      alignItems='start'
      position='relative'
      height={'80px' /* Must be hardcoded so the d&d placeholder does not mess up*/}
    >
      <Box position='relative' flexShrink={0}>
        <Image width='120px' objectFit='cover' borderRadius='sm' aspectRatio={'16/9'} src={`https://img.youtube.com/vi/${video.id}/default.jpg`} />
        {isPlaying && (
          <Icon as={BsFillPlayFill} borderRadius='full' paddingX={1} position='absolute' bottom='.2rem' left='.2rem' background='bgAlpha.100' />
        )}
        <Text as='span' fontSize='sm' paddingX={1} position='absolute' borderRadius='md' bottom='.2rem' right='.2rem' background='bgAlpha.100'>
          {FormatUtils.formatDuration(video.duration)}
        </Text>
      </Box>
      <Flex direction='column' gap={1}>
        <Heading display='inline' size='sm' noOfLines={1}>
          {video.title}
        </Heading>
        <Flex alignItems='center' gap={2}>
          <Image borderRadius='full' width='25px' objectFit='cover' aspectRatio={'1/1'} src={video.channelThumbnail} />
          <Text as='span' fontWeight='bold' fontSize='sm'>
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
        <Menu placement='left-start' isLazy autoSelect={false} onOpen={() => setIsMenuOpen(true)} onClose={() => setIsMenuOpen(false)}>
          <MenuButton
            as={IconButton}
            rounded='full'
            color='text.600'
            variant='ghost'
            aria-label='drag'
            padding={3}
            icon={<Icon as={LuMoreVertical} />}
          />
          <MenuList>
            <MenuItem icon={<Icon as={BsFillPlayFill} boxSize={4} />}>{t('playerQueue.playNow')}</MenuItem>
            <MenuItem icon={<Icon as={LuTrash2} boxSize={4} />}>{t('playerQueue.remove')}</MenuItem>
          </MenuList>
        </Menu>
        <IconButton color='text.600' variant='link' aria-label='drag' padding={3}>
          <Icon as={LuAlignJustify} />
        </IconButton>
      </Box>
    </Flex>
  );
};

export default PlayerQueue;

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

const PlayerQueue = () => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const { t } = useTranslation();
  return (
    <Flex
      as='ul'
      direction='column'
      position='fixed'
      bottom={0}
      right={'1rem'}
      bg='bgAlpha.100'
      backdropFilter='blur(5px)'
      padding={5}
      borderTopRadius='md'
      width={'600px'}
      maxWidth={'95vw'}
      boxShadow='base'
      userSelect={isExpanded ? 'auto' : 'none'}
      cursor={isExpanded ? 'auto' : 'pointer'}
      onClick={isExpanded ? undefined : () => setIsExpanded(true)}
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
        <Flex as='ul' direction='column' gap={1} paddingTop={5}>
          {queueMocks.map((video) => (
            <PlayerQueueItem video={video} key={video.id} isPlaying />
          ))}
        </Flex>
      </Collapse>
    </Flex>
  );
};

const PlayerQueueItem = ({ video, isPlaying }: { video: YoutubeVideoDetail; isPlaying?: boolean }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {t} = useTranslation();
  return (
    <Flex
      as='li'
      className={classNames('player-queue-item', { 'menu-open': isMenuOpen })}
      cursor='pointer'
      userSelect='none'
      gap={2}
      borderRadius='sm'
      padding={1}
      direction={{ base: 'column', md: 'row' }}
      alignItems='start'
      position='relative'
    >
      <Box position='relative'>
        <Image
          width={{ base: '90px', md: '120px' }}
          objectFit='cover'
          borderRadius='sm'
          aspectRatio={'16/9'}
          src={`https://img.youtube.com/vi/${video.id}/default.jpg`}
        />
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
            <MenuItem icon={<Icon as={BsFillPlayFill} boxSize={4}/>}>{t('playerQueue.playNow')}</MenuItem>
            <MenuItem  icon={<Icon as={LuTrash2} boxSize={4}/>}>{t('playerQueue.remove')}</MenuItem>
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

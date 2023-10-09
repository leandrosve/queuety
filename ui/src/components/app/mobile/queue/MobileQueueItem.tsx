import { useState, useRef, useEffect } from 'react';
import { Box, Flex, Heading, Icon, IconButton, Image, ModalProps, Text } from '@chakra-ui/react';
import { BsFillPlayFill } from 'react-icons/bs';
import { LuAlignJustify, LuMoreHorizontal } from 'react-icons/lu';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { YoutubeVideoDetail } from '../../../../services/api/YoutubeService';
import FormatUtils from '../../../../utils/FormatUtils';
import QueueItemProgressBar from '../../shared/queue/QueueItemProgressBar';
import { motion } from 'framer-motion';
import GlassModal from '../../../common/glass/GlassModal';
import LivestreamTag from '../../shared/queue/LivestreamTag';

interface Props {
  video: YoutubeVideoDetail;
  isPlaying?: boolean;
  isDragging?: boolean;
  isCurrent?: boolean;
  onRemove: () => void;
  onPlay: () => void;
  onOpenOptions?: () => void;
}
export const MobileQueueItem = ({ video, isPlaying, isCurrent, isDragging, onRemove, onPlay, onOpenOptions }: Props) => {
  const [isTapping, setIsTapping] = useState(false);

  const ref = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  useEffect(() => {
    if (isCurrent) {
      ref.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isCurrent]);

  return (
    <motion.div onTouchStart={() => setIsTapping(true)} onTouchEnd={() => setIsTapping(false)}>
      <Flex
        className={classNames({ 'is-dragging': isDragging })}
        cursor='pointer'
        userSelect='none'
        ref={ref}
        gap={0}
        onClick={onPlay}
        alignItems='start'
        maxWidth='100vw'
        position='relative'
        background={isCurrent ? 'whiteAlpha.100' : 'transparent'}
        height={'4.2rem' /* Must be hardcoded so the d&d placeholder does not mess up*/}
      >
        <Box position='relative' flexShrink={0} paddingX={2} height='4.2rem' padding='3px'>
          <Image objectFit='cover' height='100%' borderRadius='md' aspectRatio={'16/9'} src={video.thumbnail} boxShadow='sm'/>
          {isPlaying && (
            <Icon as={BsFillPlayFill} borderRadius='full' paddingX={1} position='absolute' bottom='.2rem' left='.2rem' background='bgAlpha.100' />
          )}
          {!!video.duration && (
            <Text as='span' fontSize='sm' paddingX={1} position='absolute' borderRadius='md' bottom='.2rem' right='.2rem' background='bgAlpha.100'>
              {FormatUtils.formatDuration(video.duration)}
            </Text>
          )}
          {video.live && <LivestreamTag />}
        </Box>
        <Flex direction='column' gap={1}>
          <Heading display='inline' size='sm' noOfLines={2} title={video.title} wordBreak='break-word'>
            {video.title}
          </Heading>
          <Flex alignItems='center' gap={1}>
            <Image borderRadius='full' width='20px' objectFit='cover' aspectRatio={'1/1'} src={video.channelThumbnail} />
            <Text as='span' fontSize='xs' noOfLines={1} color='text.300'>
              {video.channelTitle}
            </Text>
          </Flex>
        </Flex>
        <Box marginLeft='auto' display='flex' alignItems='center' justifyContent='end' height={'100%'}>
          <IconButton
            variant='link'
            aria-label='drag'
            visibility={isCurrent ? 'hidden' : 'visible'}
            height='100%'
            onClick={(e) => {
              e.stopPropagation();
              onOpenOptions?.();
            }}
          >
            <Icon as={LuMoreHorizontal} boxSize='1rem' />
          </IconButton>
          <IconButton variant='link' aria-label='drag' padding={2} paddingX={0} onClick={(e) => e.stopPropagation()} pointerEvents='none'>
            <Icon as={LuAlignJustify} boxSize='1rem' />
          </IconButton>
        </Box>
      </Flex>
    </motion.div>
  );
};

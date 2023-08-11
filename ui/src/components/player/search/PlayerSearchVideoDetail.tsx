import { Box, Button, Flex, Heading, IconButton, Image, Link, Text } from '@chakra-ui/react';
import { YoutubeVideoDetail } from '../../../services/api/YoutubeService';
import { LuPlay, LuListPlus, LuListEnd } from 'react-icons/lu';
import FormatUtils from '../../../utils/FormatUtils';
import { BsYoutube } from 'react-icons/bs';
import { useTranslation } from 'react-i18next';
import Logger from '../../../utils/Logger';
interface Props {
  video: YoutubeVideoDetail;
  onClose: () => void;

  onPlay: (video: YoutubeVideoDetail) => void;
  onPlayNext: (video: YoutubeVideoDetail) => void;
  onPlayLast: (video: YoutubeVideoDetail) => void;
}
const PlayerSearchVideoDetail = ({ video, onPlay, onPlayLast, onPlayNext, onClose }: Props) => {
  useTranslation();
  const handlePlay = (mode: 'now' | 'last' | 'next') => {
    switch (mode) {
      case 'now': {
        onPlay(video);
        break;
      }
      case 'last': {
        onPlayLast(video);
        break;
      }
      case 'next':
        onPlayNext(video);
    }
    onClose();
  };
  return (
    <Box>
      <Flex gap={3} direction={{ base: 'column', md: 'row' }} alignItems='start'>
        <Box position='relative' flexShrink={0}>
          <Image
            width={{ base: '100%', md: '250px' }}
            objectFit='cover'
            aspectRatio={'16/9'}
            src={video.thumbnail}
          />
          <IconButton
            as='a'
            position='absolute'
            rounded='full'
            top='.2rem'
            right='.2rem'
            colorScheme='red'
            href={`https://www.youtube.com/watch?v=${video.id}`}
            icon={<BsYoutube />}
            size='sm'
            variant='ghost'
            display='inline-flex'
            aria-label='watch in youtube'
          />
          <Text as='span' fontSize='sm' paddingX={1} position='absolute' borderRadius='md' bottom='.2rem' right='.2rem' background='bgAlpha.100'>
            {FormatUtils.formatDuration(video.duration)}
          </Text>
        </Box>
        <Flex direction='column' gap={2}>
          <Flex gap={1}>
            <Heading display='inline' size='md'>
              {video.title}
            </Heading>
          </Flex>
          <Flex alignItems='center' gap={3}>
            <Link target='_blank' href={`https://www.youtube.com/channel/${video.channelId}`}>
              <Image borderRadius='full' cursor='pointer' width='30px' objectFit='cover' aspectRatio={'1/1'} src={video.channelThumbnail} />
            </Link>
            <Text as='a' fontWeight='bold' target='_blank' href={`https://www.youtube.com/channel/${video.channelId}`}>
              {video.channelTitle}
            </Text>
          </Flex>
          <Flex alignItems='center' gap={3} wrap='wrap' fontSize='sm' color='text.300'>
            <Text as='span' flexShrink={0}>
              {FormatUtils.shortenNumber(video.viewCount)} views
            </Text>
            <Text as='span'>{FormatUtils.timeAgo(new Date(video.publishedAt))}</Text>
          </Flex>
        </Flex>
      </Flex>
      <Flex gap={2} justifyContent={{ base: 'start', md: 'space-between' }} paddingY={3} wrap='wrap'>
        <Button leftIcon={<LuPlay />} onClick={() => handlePlay('now')}>
          Reproducir ahora
        </Button>
        <Button leftIcon={<LuListPlus />} onClick={() => handlePlay('next')}>
          Reproducir a continuacion
        </Button>
        <Button leftIcon={<LuListEnd />} onClick={() => handlePlay('last')}>
          Reproducir al final
        </Button>
      </Flex>
    </Box>
  );
};

export default PlayerSearchVideoDetail;

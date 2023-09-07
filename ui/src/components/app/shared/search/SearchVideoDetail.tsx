import { Box, Button, Flex, Heading, IconButton, Image, Link, Tag, Text } from '@chakra-ui/react';
import { LuPlay, LuListPlus, LuListEnd } from 'react-icons/lu';
import { BsYoutube } from 'react-icons/bs';
import { useTranslation } from 'react-i18next';
import { YoutubeVideoDetail } from '../../../../services/api/YoutubeService';
import FormatUtils from '../../../../utils/FormatUtils';
import { useRef, useEffect } from 'react';
import LivestreamTag from '../queue/LivestreamTag';

interface Props {
  video: YoutubeVideoDetail;
  onClose: () => void;
  onPlay: (video: YoutubeVideoDetail) => void;
  onPlayNext: (video: YoutubeVideoDetail) => void;
  onPlayLast: (video: YoutubeVideoDetail) => void;
}
const SearchVideoDetail = ({ video, onPlay, onPlayLast, onPlayNext, onClose }: Props) => {
  const { t } = useTranslation();
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
  const addToQueueRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    addToQueueRef.current?.focus();
  }, [video]);
  return (
    <Box>
      <Flex gap={3} direction={{ base: 'column', md: 'row' }} alignItems='start'>
        <Box position='relative' flexShrink={0} borderRadius='md' overflow='hidden'>
          <Image width={{ base: '100%', md: '250px' }} objectFit='cover' aspectRatio={'16/9'} src={video.thumbnail} />
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
          {!!video.duration && (
            <Text as='span' fontSize='sm' paddingX={1} position='absolute' borderRadius='md' bottom='.2rem' right='.2rem' background='bgAlpha.100'>
              {FormatUtils.formatDuration(video.duration)}
            </Text>
          )}
          {video.live && <LivestreamTag />}
        </Box>
        <Flex direction='column' gap={2} minWidth={0} overflow='hidden'>
          <Flex gap={1}>
            <Heading display='inline' size='md' noOfLines={1}>
              {video.title}
            </Heading>
          </Flex>
          <Flex alignItems='center' gap={3}>
            <Link target='_blank' href={`https://www.youtube.com/channel/${video.channelId}`} flexShrink={0}>
              <Image borderRadius='full' cursor='pointer' width='30px' objectFit='cover' aspectRatio={'1/1'} src={video.channelThumbnail} />
            </Link>
            <Text as='a' fontWeight='bold' target='_blank' href={`https://www.youtube.com/channel/${video.channelId}`} noOfLines={1}>
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
      <Flex gap={2} justifyContent={{ base: 'space-between', md: 'start' }} paddingY={3} wrap='wrap'>
        <Button size='lg' leftIcon={<LuListEnd />} onClick={() => handlePlay('last')} ref={addToQueueRef} width='100%'>
          {t('playerSearch.playLast')}
        </Button>
        <Button leftIcon={<LuPlay />} onClick={() => handlePlay('now')}>
          {t('playerSearch.playNow')}
        </Button>
        <Button leftIcon={<LuListPlus />} onClick={() => handlePlay('next')}>
          {t('playerSearch.playNext')}
        </Button>
      </Flex>
    </Box>
  );
};

export default SearchVideoDetail;

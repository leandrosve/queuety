import { Box, Button, Flex, Heading, Icon, IconButton, Image, Link, Tag, Text } from '@chakra-ui/react';
import { LuPlay, LuListPlus, LuListEnd, LuListVideo } from 'react-icons/lu';
import { BsYoutube } from 'react-icons/bs';
import { useTranslation } from 'react-i18next';
import { YoutubePlaylistDetail, YoutubeVideoDetail } from '../../../../services/api/YoutubeService';
import FormatUtils from '../../../../utils/FormatUtils';
import { useRef, useEffect } from 'react';
import LivestreamTag from '../queue/LivestreamTag';

interface Props {
  playlist: YoutubePlaylistDetail;
  onClose: () => void;
  onPlay: (video: YoutubePlaylistDetail) => void;
  onPlayNext: (video: YoutubePlaylistDetail) => void;
  onPlayLast: (video: YoutubePlaylistDetail) => void;
}
const SearchPlaylistDetail = ({ playlist, onPlay, onPlayLast, onPlayNext, onClose }: Props) => {
  const { t } = useTranslation();
  const handlePlay = (mode: 'now' | 'last' | 'next') => {
    switch (mode) {
      case 'now': {
        onPlay(playlist);
        break;
      }
      case 'last': {
        onPlayLast(playlist);
        break;
      }
      case 'next':
        onPlayNext(playlist);
    }
    onClose();
  };
  const addToQueueRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    addToQueueRef.current?.focus();
  }, [playlist]);
  return (
    <Box>
      <Flex gap={3} direction={{ base: 'column', md: 'row' }} alignItems='start'>
        <Box position='relative' flexShrink={0} borderRadius='md' overflow='hidden'>
          <Image width={{ base: '100%', md: '250px' }} objectFit='cover' aspectRatio={'16/9'} src={playlist.thumbnail} />
          <IconButton
            as='a'
            position='absolute'
            rounded='full'
            top='.2rem'
            right='.2rem'
            colorScheme='red'
            href={`https://www.youtube.com/playlist?list=${playlist.id}`}
            icon={<BsYoutube />}
            size='sm'
            variant='ghost'
            display='inline-flex'
            aria-label='watch in youtube'
          />

          <Tag
            as='span'
            position='absolute'
            bottom='.2rem'
            right='.2rem'
            size='md'
            colorScheme='subtle'
            fontWeight='bold'
            variant='solid'
            display='inline-flex'
          >
            <Icon as={LuListVideo} marginRight={1}/>{playlist.itemCount} {t('common.videos')}
          </Tag>
        </Box>
        <Flex direction='column' gap={2} minWidth={0} overflow='hidden'>
          <Flex gap={1}>
            <Heading display='inline' size='md' noOfLines={1}>
              {playlist.title}
            </Heading>
          </Flex>
          <Flex alignItems='center' gap={3}>
            <Link target='_blank' href={`https://www.youtube.com/channel/${playlist.channelId}`} flexShrink={0}>
              <Image borderRadius='full' cursor='pointer' width='30px' objectFit='cover' aspectRatio={'1/1'} src={playlist.channelThumbnail} />
            </Link>
            <Text as='a' fontWeight='bold' target='_blank' href={`https://www.youtube.com/channel/${playlist.channelId}`} noOfLines={1}>
              {playlist.channelTitle}
            </Text>
          </Flex>
          
        </Flex>
      </Flex>
      <Flex gap={2} justifyContent={{ base: 'space-between', md: 'start' }} paddingY={3} wrap='wrap'>
        <Button size='lg' leftIcon={<LuListEnd />} onClick={() => handlePlay('last')} ref={addToQueueRef} width='100%'>
          {t('playerSearch.playPlaylistLast')}
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

export default SearchPlaylistDetail;

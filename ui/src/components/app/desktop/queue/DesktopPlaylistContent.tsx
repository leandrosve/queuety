import React, { useEffect, useState } from 'react';
import YoutubeService, { YoutubePlaylistItem, YoutubeVideoDetail } from '../../../../services/api/YoutubeService';
import { Box, Button, Flex, Heading, Icon, IconButton, Image, Spinner, Tag, Text } from '@chakra-ui/react';
import { LuChevronDown, LuChevronLeft, LuChevronUp, LuListVideo } from 'react-icons/lu';
import { useTranslation } from 'react-i18next';
import { DesktopQueueItem } from './DesktopQueueItem';

interface Props {
  playlistDetail: YoutubeVideoDetail;
  currentItem?: YoutubePlaylistItem | null;
  onBackToQueue: () => void;
  onCollapse: () => void;
  onPlayItem: (item: YoutubePlaylistItem) => void;
}

const DesktopPlaylistContent = ({ playlistDetail, currentItem, onBackToQueue, onCollapse, onPlayItem }: Props) => {
  const { t } = useTranslation();

  const [items, setItems] = useState<YoutubeVideoDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchItems = async (playlistId: string) => {
    setLoading(true);
    const res = await YoutubeService.getPlaylistItems(playlistId);
    if (res.data) {
      setItems(res.data.items);
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchItems(playlistDetail.id);
  }, [playlistDetail]);
  return (
    <Flex direction='column' justifyContent='space-between' gap={2}>
      <Flex
        direction='column'
        justifyContent='space-between'
        gap={2}
        bgGradient='linear(to-br, bgAlpha.200, bgAlpha.100)'
        padding={3}
        borderRadius='lg'
        borderBottomLeftRadius={0}
        borderBottomRightRadius={0}
      >
        <Flex justifyContent='space-between' gap={2}>
          <Flex direction='column' gap={1} minWidth={0} flexGrow={1}>
            <Button onClick={onBackToQueue} rounded='full' variant='outline' bg='bgAlpha.200' leftIcon={<LuChevronLeft />} aria-label='back to queue'>
              Back to queue
            </Button>
          </Flex>
          <IconButton onClick={onCollapse} rounded='full' icon={true ? <LuChevronDown /> : <LuChevronUp />} aria-label='expand/collapse' />
        </Flex>
        <Flex padding={2} gap={2} borderRadius='lg'>
          <Box position='relative' flexShrink={0}>
            <Image width='120px' minHeight='100%' objectFit='cover' borderRadius='lg' aspectRatio={'16/9'} src={playlistDetail.thumbnail} />
          </Box>
          <Flex direction='column' gap={1}>
            <Heading display='inline' size='sm' noOfLines={1} title={playlistDetail.title}>
              {playlistDetail.title}
            </Heading>
            <Flex alignItems='center' gap={2}>
              <Image borderRadius='full' width='25px' objectFit='cover' aspectRatio={'1/1'} src={playlistDetail.channelThumbnail} />
              <Text as='span' fontWeight='bold' fontSize='sm' noOfLines={1}>
                {playlistDetail.channelTitle}
              </Text>
            </Flex>
            <Flex alignItems='center' gap={3}>
              <Tag
                as='span'
                size='md'
                fontWeight='bold'
                variant='subtle'
                display='inline-flex'
                bg='bgAlpha.100'
                alignSelf='start'
                border='1px solid'
                borderColor='bgAlpha.300'
              >
                Playlist <Icon as={LuListVideo} marginX={1} />
                {playlistDetail.itemCount} {t('common.videos')}
              </Tag>
              <Text fontSize='sm' color='text.300'>
                Playing: 1 / 200
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </Flex>

      <Flex direction='column' gap={0} minHeight={300} maxHeight={500} overflow='hidden' overflowY='auto' padding={5} paddingTop={0}>
        {items.map((item, index) => {
          return (
            <DesktopQueueItem
              key={item.id}
              video={item}
              onPlay={() => {
                onPlayItem({ playlistId: playlistDetail.id, detail: item, index });
              }}
              onRemove={() => {}}
              isCurrent={currentItem?.playlistId == playlistDetail.id && currentItem?.index == index}
              isPlaylistItem
            />
          );
        })}
        {loading && <Spinner margin='auto' />}
      </Flex>
    </Flex>
  );
};

export default DesktopPlaylistContent;

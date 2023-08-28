import { Flex, Heading, Icon, Image, Stack, Text } from '@chakra-ui/react';
import './player.css';
import { YoutubeVideoDetail } from '../../../../services/api/YoutubeService';
import FormatUtils from '../../../../utils/FormatUtils';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { BsCircleFill, BsDash, BsRecordFill } from 'react-icons/bs';

interface Props {
  video: YoutubeVideoDetail;
}

const PlayerDescription = ({ video }: Props) => {
  const { t } = useTranslation();
  const timeAgo = useMemo(() => FormatUtils.timeAgo(new Date(video.publishedAt)), [t, video]);
  return (
    <Stack minWidth={0} overflow='hidden'>
      <Heading size='sm' fontWeight='normal' noOfLines={1}>
        {video.title}
      </Heading>
      <Flex alignItems='center' gap={2} fontSize='sm' color='text.300'>
        <Image src={video.channelThumbnail} height='1.3rem' width='1.3rem' rounded='full' flexShrink={0} />
        <Text noOfLines={1}>{video.channelTitle}</Text>
        <Flex flexShrink={0} gap={2} alignItems='center'>
          <Icon as={BsRecordFill} aria-hidden boxSize='8px' opacity={0.3} />
          <Text noOfLines={1}>{timeAgo}</Text>
        </Flex>
      </Flex>
    </Stack>
  );
};

export default PlayerDescription;

import { Flex, Heading, Image, Stack, Text } from '@chakra-ui/react';
import './player.css';
import { YoutubeVideoDetail } from '../../../../services/api/YoutubeService';

interface Props {
  video: YoutubeVideoDetail;
}

const PlayerDescription = ({ video }: Props) => {
  return (
    <Stack>
      <Heading size='sm' fontWeight='normal' noOfLines={1}>
        {video.title}
      </Heading>
      <Flex alignItems='center' gap={2} fontSize='sm'>
        <Image src={video.channelThumbnail} height='1.5rem' width='1.5rem' rounded='full' />
        <Text noOfLines={1}>{video.channelTitle}</Text>
      </Flex>
    </Stack>
  );
};

export default PlayerDescription;

import { Box, Flex, Image, Stack, Text } from '@chakra-ui/react';
import './visualizer.css';
import { YoutubeVideoDetail } from '../../../../services/api/YoutubeService';

interface Props {
  video: YoutubeVideoDetail;
}
const VisualizerVideo = ({ video }: Props) => {
  if (!video) return <VisualizerPlaceholder />;
  return (
    <>
      <Flex className='visualizer' position='relative' width='100vw' aspectRatio='16/9' justifyContent='center' alignItems='center'>
        <Box borderRadius='md' aspectRatio='16/9' width='90%' margin={'5px'} boxShadow='xl' position='relative'>
          <Image
            aspectRatio='16/9'
            width='100%'
            opacity={0.85}
            objectFit='cover'
            src={`https://img.youtube.com/vi/${video.id}/sddefault.jpg`}
          ></Image>
        </Box>

        <Box className='visualizer-backdrop'>
          <Image className='visualizer-backdrop-image' src={`https://img.youtube.com/vi/${video.id}/default.jpg`} />
          <Box className='visualizer-backdrop-blur' />
        </Box>
      </Flex>
      <Text noOfLines={2} paddingX={2}>{video.title}</Text>
    </>
  );
};

const VisualizerPlaceholder = () => (
  <Flex className='visualizer' position='relative' width='100vw' aspectRatio='16/9' justifyContent='center' alignItems='center'>
    <Flex
      justifyContent='center'
      alignItems='center'
      borderRadius='md'
      aspectRatio='16/9'
      width='90%'
      margin={'5px'}
      opacity={0.85}
      objectFit='cover'
      boxShadow='xl'
    >
      <Text>Awaiting</Text>
    </Flex>
  </Flex>
);

export default VisualizerVideo;

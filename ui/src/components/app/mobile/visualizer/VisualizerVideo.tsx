import { Box, Flex, Image, Stack, Text } from '@chakra-ui/react';
import './visualizer.css';
import { YoutubeVideoDetail } from '../../../../services/api/YoutubeService';
import { useState, useEffect } from 'react';
import classNames from 'classnames';

interface Props {
  video: YoutubeVideoDetail;
}
const VisualizerVideo = ({ video }: Props) => {
  if (!video) return <VisualizerPlaceholder />;
  return (
    <Stack align='center' spacing={0}>
      <Flex className='visualizer' position='relative' width='100vw' aspectRatio='16/9' justifyContent='center' alignItems='center'>
        <Box borderRadius='md' aspectRatio='16/9' width='90%' margin={'5px'} boxShadow='xl' position='relative'>
          <Image aspectRatio='16/9' width='100%' opacity={0.85} objectFit='cover' src={video.thumbnail}></Image>
        </Box>
      </Flex>
      <VisualizerBackdrop src={video.thumbnail} />
    </Stack>
  );
};

const VisualizerBackdrop = ({ src }: { src: string }) => {
  const [state, setState] = useState<{ sourceA?: string; sourceB?: string; index: number }>({ index: 0 });

  useEffect(() => {
    setState((prev) => {
      return {
        index: prev.index + 1,
        sourceA: prev.index % 2 == 0 ? src : prev.sourceA,
        sourceB: prev.index % 2 == 1 ? src : prev.sourceB,
      };
    });
  }, [src]);
  return (
    <Flex className={classNames('visualizer-backdrop')}>
      <img src={state.sourceA} className={`visualizer-backdrop-img first-image ${state.index % 2 ? 'fade-in' : ''}`} />
      <img src={state.sourceB} className={`visualizer-backdrop-img second-image ${!(state.index % 2) ? 'fade-in' : ''}`} />
    </Flex>
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

import { Box, Flex, Image } from '@chakra-ui/react';
import './player-backdrop.css';
import { useMemo } from 'react';
interface Props {
  videoId: string;
  state: YT.PlayerState;
}

const PlayerBackdrop = ({ videoId, state }: Props) => {
  const animate = useMemo(() => [YT.PlayerState.PLAYING, YT.PlayerState.BUFFERING].includes(state), [state]);
  return (
    <Flex className={`player-backdrop ${animate ? 'animate' : ''}`}>
      <div className='player-backdrop__image-container'>
        <Image className='player-backdrop__image' src={`https://img.youtube.com/vi/${videoId}/sddefault.jpg`} />
      </div>
      <Box className='player-backdrop__blur'></Box>
    </Flex>
  );
};

export default PlayerBackdrop;

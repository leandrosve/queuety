import { Box, Flex, Image } from '@chakra-ui/react';
import './player-backdrop.css';
import { useMemo } from 'react';
interface Props {
  videoId?: string;
  image?: string;
  state: PlayerState;
}

enum PlayerState {
  ENDED = 0,
  PLAYING = 1,
  PAUSED = 2,
  BUFFERING = 3,
  CUED = 4,
}

const PlayerBackdrop = ({ videoId, image, state }: Props) => {
  const animate = useMemo(() => [PlayerState.PLAYING, PlayerState.BUFFERING].includes(state), [state]);
  return (
    <Flex className={`player-backdrop ${animate ? 'animate' : ''}`}>
      <div className='player-backdrop__image-container'>
        <Image className='player-backdrop__image' src={image ?? `https://img.youtube.com/vi/${videoId}/sddefault.jpg`} />
      </div>
      <Box className='player-backdrop__blur'></Box>
    </Flex>
  );
};

export default PlayerBackdrop;

import { Flex } from '@chakra-ui/react';
import useYoutubePlayer from '../../hooks/player/useYoutubePlayer';
import PlayerTrack from './controls/PlayerTrack';
import PlayerBackdrop from './PlayerBackdrop';
import './player.css';
interface Props {
  videoId: string;
}
const Player = ({ videoId }: Props) => {
  const { duration, state, currentTime, playbackRate, controls } = useYoutubePlayer('player-container', videoId);

  return (
    <Flex direction='column' gap={3} width={{ base: '95vw', md: 750, lg: 900 }}>
      <Flex direction='column' gap={3} position='relative' width='100%' height={0} paddingBottom='56.25%'>
        <div className='player-container' id='player-container'/>
      </Flex>

      <PlayerBackdrop videoId={videoId} state={state} />
      <PlayerTrack duration={duration} currentTime={currentTime} playbackRate={playbackRate} state={state} {...controls} />
    </Flex>
  );
};

export default Player;

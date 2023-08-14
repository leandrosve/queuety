import { Box, Flex, Skeleton, Spinner } from '@chakra-ui/react';
import useYoutubePlayer from '../../hooks/player/useYoutubePlayer';
import PlayerBackdrop from './PlayerBackdrop';
import './player.css';
import QueueItem from '../../model/player/QueueItem';
import PlayerControls from './controls/PlayerControls';
import { useEffect } from 'react';

interface Props {
  queueItem: QueueItem;
}
const Player = ({ queueItem }: Props) => {
  const { duration, state, currentTime, isReady, playbackRate, controls } = useYoutubePlayer('player-container', queueItem);

  useEffect(() => console.log('READY CHANGED'), [isReady]);
  return (
    <Flex direction='column' gap={3} width={{ base: '95vw', md: 750, lg: 900 }} paddingBottom='100px'>
      <Box>
        <Flex direction='column' background='bgAlpha.100' gap={3} position='relative' width='100%' height={0} paddingBottom='56.25%'>
          {!isReady && <Skeleton boxShadow='base' height={'100%'} position='absolute' margin='auto' top={0} left={0} bottom={0} right={0} />}
          <Box opacity={isReady ? 1 : 0}>
            <div className='player-container' id='player-container' />
          </Box>
        </Flex>
      </Box>
      <PlayerBackdrop videoId={queueItem.video.id} state={state} />
      <PlayerControls state={state} playbackRate={playbackRate} {...controls} />
      {/*<PlayerTrack duration={duration} currentTime={currentTime} playbackRate={playbackRate} state={state} {...controls} />*/}
    </Flex>
  );
};

export default Player;

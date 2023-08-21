import { Box, Flex, Skeleton } from '@chakra-ui/react';
import useYoutubePlayer from '../../../../hooks/player/useYoutubePlayer';
import './player.css';
import QueueItem from '../../../../model/player/QueueItem';
import PlayerBackdrop from '../../shared/player/PlayerBackdrop';
import PlayerControls from '../../shared/player/controls/PlayerControls';

interface Props {
  queueItem: QueueItem;
}
const Player = ({ queueItem }: Props) => {
  const { state, isReady, playbackRate, controls } = useYoutubePlayer('player-container', queueItem);
  return (
    <Flex direction='column' gap={3} width={{ base: '95vw', md: 750, lg: 900 }}>
      <Box>
        <Flex direction='column' background='bgAlpha.100' gap={3} position='relative' width='100%' height={0} paddingBottom='56.25%'>
          {!isReady && <Skeleton boxShadow='base' height={'100%'} position='absolute' margin='auto' top={0} left={0} bottom={0} right={0} />}
          <Box opacity={isReady ? 1 : 0}>
            <div className='player-container' id='player-container' />
          </Box>
        </Flex>
      </Box>
      <PlayerBackdrop videoId={queueItem.video.id} state={state} />
      {/*<PlayerTrack duration={duration} currentTime={currentTime} playbackRate={playbackRate} state={state} {...controls} />*/}
    </Flex>
  );
};

export default Player;

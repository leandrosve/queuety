import { Box, Button, Flex, Skeleton } from '@chakra-ui/react';
import './player.css';
import QueueItem from '../../../../model/player/QueueItem';
import PlayerBackdrop from './PlayerBackdrop';
import PlayerStatus from '../../../../model/player/PlayerStatus';
import classNames from 'classnames';
import PlayerFullScreenOverlay from './PlayerFullscreenOverlay';
import { useRef, useEffect } from 'react';

interface Props {
  queueItem: QueueItem;
  status: PlayerStatus;
  fullscreen?: boolean;
  onFullscreenChange: (open: boolean) => void;
}
const Player = ({ queueItem, status, fullscreen, onFullscreenChange }: Props) => {
  return (
    <Flex direction='column' gap={3} width={{ base: '95vw', md: 750, lg: 900 }}>
      {fullscreen && <div className='player-fullscreen-backdrop' onClick={() => onFullscreenChange(false)} />}
      {fullscreen && <PlayerFullScreenOverlay onFullscreenChange={() => onFullscreenChange(false)} />}
      <Flex
        direction='column'
        background='bgAlpha.100'
        gap={3}
        position='relative'
        width='100%'
        height={0}
        paddingBottom='56.25%'
        borderRadius='md'
        overflow='hidden'
      >
        {!status.isReady && <Skeleton boxShadow='base' height={'100%'} position='absolute' margin='auto' top={0} left={0} bottom={0} right={0} />}
        <Box className={classNames('player-wrapper', { fullscreen })} opacity={status.isReady ? 1 : 0}>
          <div className='player-container' id='player-container' />
        </Box>
      </Flex>

      <PlayerBackdrop videoId={queueItem.video.id} state={status.state} />
      {/*<PlayerTrack duration={duration} currentTime={currentTime} playbackRate={playbackRate} state={state} {...controls} />*/}
    </Flex>
  );
};

export default Player;

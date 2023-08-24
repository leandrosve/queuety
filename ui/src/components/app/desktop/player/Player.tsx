import { Box, Flex, Heading, Image, Skeleton, Stack, Text } from '@chakra-ui/react';
import './player.css';
import QueueItem from '../../../../model/player/QueueItem';
import PlayerBackdrop from './PlayerBackdrop';
import PlayerStatus from '../../../../model/player/PlayerStatus';

interface Props {
  queueItem: QueueItem;
  status: PlayerStatus
}
const Player = ({ queueItem, status }: Props) => {
  return (
    <Flex direction='column' gap={3} width={{ base: '95vw', md: 750, lg: 900 }}>
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
        <Box opacity={status.isReady ? 1 : 0}>
          <div className='player-container' id='player-container' />
        </Box>
      </Flex>

      <PlayerBackdrop videoId={queueItem.video.id} state={status.state} />
      {/*<PlayerTrack duration={duration} currentTime={currentTime} playbackRate={playbackRate} state={state} {...controls} />*/}
    </Flex>
  );
};

export default Player;

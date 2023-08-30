import useMobileQueue from '../../../hooks/queue/useMobileQueue';
import { Flex } from '@chakra-ui/react';
import VisualizerControls from './visualizer/VisualizerControls';
import VisualizerVideo from './visualizer/VisualizerVideo';
import './visualizer/visualizer.css';
import useMobilePlayerStatus from '../../../hooks/player/useMobilePlayerStatus';
import PlayerTrack from '../shared/player/PlayerTrack';
import HostData from '../../../model/auth/HostData';
import MobileQueueContent from './queue/MobileQueueContent';

interface Props {
  playerRoomId: string;
  userId: string;
  host: HostData;
}
const MobileAppLandscapeView = ({ playerRoomId, userId, host }: Props) => {
  const { queue, controls: queueControls } = useMobileQueue(playerRoomId, userId);
  const { status: playerStatus, controls: playerControls } = useMobilePlayerStatus();
  return (
    <Flex direction='row' justifyContent='start' alignSelf='start' gap={0}>
      <Flex direction='column' alignItems='center' width='50vw' alignSelf='stretch' gap={0}>
        <VisualizerVideo video={queue.currentItem?.video} status={playerStatus} playerControls={playerControls} host={host} />
        <VisualizerControls status={playerStatus} controls={playerControls} queueControls={queueControls} />
        <Flex justifyContent='stretch' alignSelf='stretch' paddingX={5} mb={4}>
          <PlayerTrack status={playerStatus} onTimeChange={playerControls.onTimeChange} currentQueuedVideo={queue.currentItem?.video} />
        </Flex>
      </Flex>
      <Flex direction='column' position='relative' alignItems='center' width='50vw' alignSelf='stretch' gap={0}>
        <MobileQueueContent
          queue={queue.items}
          currentItem={queue.currentItem}
          currentIndex={queue.currentIndex}
          onClear={queueControls.onClear}
          onPlay={queueControls.onPlay}
          onRemove={queueControls.onRemove}
          onChangeOrder={queueControls.onChangeOrder}
          onSkip={queueControls.onSkip}
        />
      </Flex>
    </Flex>
  );
};

export default MobileAppLandscapeView;

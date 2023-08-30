import useMobileQueue from '../../../hooks/queue/useMobileQueue';
import { Flex } from '@chakra-ui/react';
import VisualizerControls from './visualizer/VisualizerControls';
import VisualizerVideo from './visualizer/VisualizerVideo';
import './visualizer/visualizer.css';
import SearchModal from '../shared/search/SearchModal';
import { useState } from 'react';
import useMobilePlayerStatus from '../../../hooks/player/useMobilePlayerStatus';
import PlayerTrack from '../shared/player/PlayerTrack';
import MobileNotifications from './connection/MobileNotifications';
import HostData from '../../../model/auth/HostData';
import SearchLinkButton from '../shared/search/SearchLinkButton';
import { useMobileAuthContext } from '../../../context/MobileAuthContext';
import MobileQueuePortrait from './queue/MobileQueuePortrait';

interface Props {
  playerRoomId: string;
  userId: string;
  host: HostData;
}
const MobileAppPlayerView = ({ playerRoomId, userId, host }: Props) => {
  const { queue, controls: queueControls } = useMobileQueue(playerRoomId, userId);
  const { status: playerStatus, controls: playerControls } = useMobilePlayerStatus();
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const { hostStatus } = useMobileAuthContext();
  return (
    <Flex direction='column' alignItems='center' justifyContent='start' alignSelf='stretch' gap={0} width={'100vw'}>
      <SearchLinkButton onClick={() => setIsSearchModalOpen(true)} marginX={4} alignSelf='stretch' />
      <VisualizerVideo video={queue.currentItem?.video} status={playerStatus} playerControls={playerControls} host={host} />
      <VisualizerControls status={playerStatus} controls={playerControls} queueControls={queueControls} />
      <Flex justifyContent='stretch' alignSelf='stretch' paddingX={5} mb={4}>
        <PlayerTrack
          status={playerStatus}
          onTimeChange={playerControls.onTimeChange}
          currentQueuedVideo={queue.currentItem?.video}
          hostStatus={hostStatus}
        />
      </Flex>
      <MobileNotifications />
      <MobileQueuePortrait
        queue={queue.items}
        currentItem={queue.currentItem}
        currentIndex={queue.currentIndex}
        onClear={queueControls.onClear}
        onPlay={queueControls.onPlay}
        onRemove={queueControls.onRemove}
        onChangeOrder={queueControls.onChangeOrder}
        onSkip={queueControls.onSkip}
      />
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onPlay={queueControls.onAddNow}
        onPlayLast={queueControls.onAddLast}
        onPlayNext={queueControls.onAddNext}
      />
    </Flex>
  );
};

export default MobileAppPlayerView;

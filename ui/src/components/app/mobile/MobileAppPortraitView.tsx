import useMobileQueue from '../../../hooks/queue/useMobileQueue';
import { Flex } from '@chakra-ui/react';
import VisualizerControls from './visualizer/VisualizerControls';
import VisualizerVideo from './visualizer/VisualizerVideo';
import './visualizer/visualizer.css';
import SearchModal from '../shared/search/SearchModal';
import { useState } from 'react';
import useMobilePlayerStatus, { MobilePlayerControls } from '../../../hooks/player/useMobilePlayerStatus';
import PlayerTrack from '../shared/player/PlayerTrack';
import MobileNotifications from './connection/MobileNotifications';
import HostData from '../../../model/auth/HostData';
import SearchLinkButton from '../shared/search/SearchLinkButton';
import { useMobileAuthContext } from '../../../context/MobileAuthContext';
import MobileQueuePortrait from './queue/MobileQueuePortrait';
import { QueueData } from '../../../hooks/queue/useDesktopQueue';
import { QueueControls } from '../../../hooks/queue/useQueue';
import PlayerStatus from '../../../model/player/PlayerStatus';

interface Props {
  host: HostData;
  queue: QueueData;
  queueControls: QueueControls;
  playerStatus: PlayerStatus;
  playerControls: MobilePlayerControls;
}

const MobileAppPortraitView = ({ queue, queueControls, playerControls, playerStatus, host }: Props) => {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const { hostStatus } = useMobileAuthContext();
  return (
    <Flex direction='column' alignItems='center' justifyContent='start' paddingTop={2} alignSelf='stretch' gap={0} width={'100vw'}>
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

export default MobileAppPortraitView;

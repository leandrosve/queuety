import { Flex } from '@chakra-ui/react';
import VisualizerControls from './visualizer/VisualizerControls';
import VisualizerVideo from './visualizer/VisualizerVideo';
import './visualizer/visualizer.css';
import { MobilePlayerControls } from '../../../hooks/player/useMobilePlayerStatus';
import PlayerTrack from '../shared/player/PlayerTrack';
import HostData from '../../../model/auth/HostData';
import MobileQueueContent from './queue/MobileQueueContent';
import { QueueControls } from '../../../hooks/queue/useQueue';
import PlayerStatus from '../../../model/player/PlayerStatus';
import { QueueData } from '../../../hooks/queue/useDesktopQueue';
import SearchLinkButton from '../shared/search/SearchLinkButton';
import { useState } from 'react';

interface Props {
  host: HostData;
  queue: QueueData;
  queueControls: QueueControls;
  playerStatus: PlayerStatus;
  playerControls: MobilePlayerControls;
}

const MobileAppLandscapeView = ({ queue, queueControls, playerControls, playerStatus, host }: Props) => {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  return (
    <Flex direction='row' justifyContent='start' alignSelf='start' gap={0} marginRight='auto'>
      <Flex direction='column' alignItems='center' width='45vw' alignSelf='stretch' gap={0}>
        <VisualizerVideo video={queue.currentItem?.video} status={playerStatus} playerControls={playerControls} host={host} />
        <VisualizerControls status={playerStatus} controls={playerControls} queueControls={queueControls} />
        <Flex justifyContent='stretch' alignSelf='stretch' paddingX={5} mb={4}>
          <PlayerTrack status={playerStatus} onTimeChange={playerControls.onTimeChange} currentQueuedVideo={queue.currentItem?.video} />
        </Flex>
      </Flex>
      <Flex direction='column' padding={2} position='fixed' top={0} right={0} alignItems='center' width='55vw' alignSelf='stretch' gap={0}>
        <SearchLinkButton onClick={() => setIsSearchModalOpen(true)} alignSelf='stretch' marginBottom={3}/>
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

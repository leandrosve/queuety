import { Box, Flex } from '@chakra-ui/react';
import VisualizerControls from './visualizer/VisualizerControls';
import VisualizerVideo from './visualizer/VisualizerVideo';
import './visualizer/visualizer.css';
import { useState } from 'react';
import { MobilePlayerControls } from '../../../hooks/player/useMobilePlayerStatus';
import PlayerTrack from '../shared/player/PlayerTrack';
import HostData from '../../../model/auth/HostData';
import SearchLinkButton from '../shared/search/SearchLinkButton';
import { useMobileAuthContext } from '../../../context/MobileAuthContext';
import MobileQueuePortrait from './queue/MobileQueuePortrait';
import { QueueData } from '../../../hooks/queue/useDesktopQueue';
import { QueueControls } from '../../../hooks/queue/useQueue';
import PlayerStatus from '../../../model/player/PlayerStatus';
import MobileAppWelcome from './MobileAppWelcome';
import usePageOrientation from '../../../hooks/layout/usePageOrientation';
import VisualizerLandscapeMode from './visualizer/VisualizerLandscapeMode';
import MobileQueueLandscape from './queue/MobileQueueLandscape';
import './mobile-view.css';
import VisualizerBackdrop from './visualizer/VisualizerBackdrop';

interface Props {
  host: HostData;
  queue: QueueData;
  queueControls: QueueControls;
  playerStatus: PlayerStatus;
  playerControls: MobilePlayerControls;
  onOpenSearchModal: () => void;
}

const MobileAppUnifiedView = ({ queue, queueControls, playerControls, playerStatus, host, onOpenSearchModal }: Props) => {
  const { hostStatus } = useMobileAuthContext();
  const { portrait } = usePageOrientation();
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  return (
    <Box className='mobile-unified-view'>
      {queue.currentItem?.video && <VisualizerBackdrop src={queue.currentItem?.video.thumbnail} />}

      {queue.length ? (
        <>
          {portrait && <SearchLinkButton onClick={onOpenSearchModal} marginX={4} alignSelf='stretch' />}

          {portrait ? (
            <VisualizerVideo video={queue.currentItem?.video} status={playerStatus} playerControls={playerControls} host={host} />
          ) : (
            <VisualizerLandscapeMode
              video={queue.currentItem?.video}
              playerControls={playerControls}
              playerStatus={playerStatus}
              host={host}
              onOpenQueue={() => setIsQueueOpen(true)}
            />
          )}
          <VisualizerControls status={playerStatus} controls={playerControls} queueControls={queueControls} />
          <Flex justifyContent='stretch' alignSelf='stretch' paddingX={5} mb={4}>
            <PlayerTrack
              status={playerStatus}
              onTimeChange={playerControls.onTimeChange}
              currentQueuedVideo={queue.currentItem?.video}
              hostStatus={hostStatus}
            />
          </Flex>
          {portrait ? (
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
          ) : (
            <MobileQueueLandscape
              queue={queue.items}
              currentItem={queue.currentItem}
              currentIndex={queue.currentIndex}
              onClear={queueControls.onClear}
              onPlay={queueControls.onPlay}
              onRemove={queueControls.onRemove}
              onChangeOrder={queueControls.onChangeOrder}
              onSkip={queueControls.onSkip}
              isOpen={isQueueOpen}
              onClose={() => setIsQueueOpen(false)}
              onOpenSearchModal={onOpenSearchModal}
            />
          )}
        </>
      ) : (
        <MobileAppWelcome host={host} onOpenSearchModal={onOpenSearchModal} />
      )}
    </Box>
  );
};

export default MobileAppUnifiedView;

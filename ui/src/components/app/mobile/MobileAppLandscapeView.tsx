import { Box, CloseButton, Flex, Icon } from '@chakra-ui/react';
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
import SearchModal from '../shared/search/SearchModal';
import MobileNotifications from './connection/MobileNotifications';
import MobileAppWelcome from './MobileAppWelcome';
import VisualizerLandscapeMode from './visualizer/VisualizerLandscapeMode';
import BrandIcon from '../../../assets/images/BrandIcon';
import Drawer from '../../common/drawer/Drawer';
import GlassContainer from '../../common/glass/GlassContainer';

interface Props {
  host: HostData;
  queue: QueueData;
  queueControls: QueueControls;
  playerStatus: PlayerStatus;
  playerControls: MobilePlayerControls;
  timeTimestamp: number;
}

const MobileAppLandscapeView = ({ queue, queueControls, playerControls, playerStatus, host, timeTimestamp }: Props) => {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isQueueOpen, setIsQueueOpen] = useState(false);

  return (
    <Flex direction='column' justifyContent='center' alignSelf='start' gap={0} marginRight='auto' grow={1} height={'100vh'}>
      {queue.length ? (
        <>
          <VisualizerLandscapeMode
            video={queue.currentItem?.video}
            queue={queue}
            queueControls={queueControls}
            playerControls={playerControls}
            playerStatus={playerStatus}
            host={host}
            timeTimestamp={timeTimestamp}
            onOpenQueue={() => setIsQueueOpen(true)}
          />
          <Drawer isOpen={isQueueOpen} onClose={() => setIsQueueOpen(false)}>
            <Flex width={'45vw'} padding={3} direction='column' maxHeight='100vh'>
              <Flex height='3rem' alignItems='start' gap={4} justifyContent='space-between' paddingBottom={3}>
                <SearchLinkButton flexGrow={1} onClick={() => setIsSearchModalOpen(true)} alignSelf='stretch' marginBottom={3} />
                <CloseButton onClick={() => setIsQueueOpen(false)} />
              </Flex>

              <GlassContainer asBefore />
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
          </Drawer>
        </>
      ) : (
        <MobileAppWelcome host={host} onOpenSearchModal={() => setIsSearchModalOpen(true)} />
      )}

      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onPlay={queueControls.onAddNow}
        onPlayLast={queueControls.onAddLast}
        onPlayNext={queueControls.onAddNext}
      />
      <MobileNotifications />
    </Flex>
  );
};

export default MobileAppLandscapeView;

import useMobileQueue from '../../../hooks/queue/useMobileQueue';
import { Button, Flex, Text } from '@chakra-ui/react';
import VisualizerControls from './visualizer/VisualizerControls';
import MobileQueue from './queue/MobileQueue';
import { BsSearch } from 'react-icons/bs';
import { useTranslation } from 'react-i18next';
import { useMobileAuthContext } from '../../../context/MobileAuthContext';
import VisualizerVideo from './visualizer/VisualizerVideo';
import './visualizer/visualizer.css';
import SearchModal from '../shared/search/SearchModal';
import { useState } from 'react';
import useMobilePlayerStatus from '../../../hooks/player/useMobilePlayerStatus';
import PlayerTrack from '../shared/player/PlayerTrack';
import MobileNotifications from './connection/MobileNotifications';
import HostData from '../../../model/auth/HostData';

interface Props {
  playerRoomId: string;
  userId: string;
  host: HostData;
}
const MobileAppPlayerView = ({ playerRoomId, userId, host }: Props) => {
  const { t } = useTranslation();
  const { queue, controls: queueControls } = useMobileQueue(playerRoomId, userId);
  const { status, controls: playerControls } = useMobilePlayerStatus();
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  return (
    <Flex direction='column' alignItems='center' justifyContent='start' alignSelf='stretch' gap={0}>
      <Button display='flex' alignSelf='stretch' justifyContent='start' gap={5} onClick={() => setIsSearchModalOpen(true)} marginX={4}>
        <BsSearch />
        <Text as='span'>{t('playerSearch.pasteUrl')}</Text>
      </Button>
      <VisualizerVideo video={queue.currentItem?.video} status={status} playerControls={playerControls} host={host}/>

      <VisualizerControls status={status} controls={playerControls} queueControls={queueControls} />
      <Flex justifyContent='stretch' alignSelf='stretch' paddingX={5} mb={4}>
        <PlayerTrack
          currentTime={status.currentTime}
          duration={status.duration}
          onTimeChange={playerControls.onTimeChange}
          playbackRate={status.playbackRate}
          state={status.state}
        />
      </Flex>
      <MobileNotifications />
      <MobileQueue
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

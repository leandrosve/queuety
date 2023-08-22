import useMobileQueue from '../../../hooks/queue/useMobileQueue';
import { Box, Button, Flex, Image, Text } from '@chakra-ui/react';
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

const MobileAppPlayerView = () => {
  const { t } = useTranslation();
  const { playerRoomId, userId } = useMobileAuthContext();
  const { queue, controls } = useMobileQueue(playerRoomId, userId);
  const { status } = useMobilePlayerStatus();
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  return (
    <Flex direction='column' alignItems='center' justifyContent='start' alignSelf='stretch' gap={3}>
      <Button display='flex' alignSelf='stretch' justifyContent='start' gap={5} onClick={() => setIsSearchModalOpen(true)} marginX={4}>
        <BsSearch />
        <Text as='span'>{t('playerSearch.pasteUrl')}</Text>
      </Button>
      <VisualizerVideo video={queue.currentItem?.video} status={status} />

      <VisualizerControls status={status} state={1} onPlay={() => {}} onForward={() => {}} onPause={() => {}} onRewind={() => {}} playbackRate={1} />
      <Flex justifyContent='stretch' alignSelf='stretch' paddingX={5}>
        <PlayerTrack currentTime={status.currentTime} duration={status.duration} onTimeChange={() => {}} playbackRate={1} state={status.state} />
      </Flex>
      <MobileQueue
        queue={queue.items}
        currentItem={queue.currentItem}
        currentIndex={queue.currentIndex}
        onClear={controls.onClear}
        onPlay={controls.onPlay}
        onRemove={controls.onRemove}
        onChangeOrder={controls.onChangeOrder}
        onSkip={controls.onSkip}
      />
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onPlay={controls.onAddNow}
        onPlayLast={controls.onAddLast}
        onPlayNext={controls.onAddNext}
      />
    </Flex>
  );
};

export default MobileAppPlayerView;

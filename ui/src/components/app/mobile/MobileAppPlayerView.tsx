import useMobileQueue from '../../../hooks/queue/useMobileQueue';
import { Box, Button, Flex, Image, Text } from '@chakra-ui/react';
import VisualizerControls from './visualizer/VisualizerControls';
import MobileQueue from './queue/MobileQueue';
import { BsSearch } from 'react-icons/bs';
import PlayerTrack from '../shared/player/controls/PlayerTrack';
import PlayerState from '../../../model/player/PlayerState';
import { useTranslation } from 'react-i18next';
import { useMobileAuthContext } from '../../../context/MobileAuthContext';
import VisualizerVideo from './visualizer/VisualizerVideo';
import './visualizer/visualizer.css';

const MobileAppPlayerView = () => {
  const { t } = useTranslation();
  const { playerRoomId } = useMobileAuthContext();
  const { queue } = useMobileQueue(playerRoomId);
  return (
    <Flex direction='column' alignItems='center' justifyContent='start' alignSelf='stretch' gap={3}>
      <Button display='flex' alignSelf='stretch' justifyContent='start' gap={5} onClick={() => {}} marginX={4}>
        <BsSearch />
        <Text as='span'>{t('playerSearch.pasteUrl')}</Text>
      </Button>
      <VisualizerVideo video={queue.currentItem?.video} />
      <VisualizerControls state={1} onPlay={() => {}} onForward={() => {}} onPause={() => {}} onRewind={() => {}} playbackRate={1} />
      <Flex justifyContent='stretch' alignSelf='stretch' paddingX={5}>
        <PlayerTrack duration={100} onTimeChange={() => {}} playbackRate={1} state={PlayerState.PAUSED} />
      </Flex>
      <Flex grow={1}></Flex>
      <MobileQueue queue={queue.items} currentItem={queue.currentItem} currentIndex={queue.currentIndex} />
    </Flex>
  );
};

export default MobileAppPlayerView;

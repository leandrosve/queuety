import { Box, Flex, Icon, IconButton, Image, Stack, Text, useColorMode } from '@chakra-ui/react';
import { YoutubeVideoDetail } from '../../../../services/api/YoutubeService';
import PlayerStatus from '../../../../model/player/PlayerStatus';
import HostData from '../../../../model/auth/HostData';
import { PlayerControls } from '../../../../hooks/player/useDesktopPlayer';
import { QueueData } from '../../../../hooks/queue/useDesktopQueue';
import { QueueControls } from '../../../../hooks/queue/useQueue';
import VisualizerHostBadge from './VisualizerHostBadge';
import VisualizerControlsOverlay from './VisualizerControlsOverlay';
import VisualizerControls from './VisualizerControls';
import PlayerTrack from '../../shared/player/PlayerTrack';
import { useMobileAuthContext } from '../../../../context/MobileAuthContext';
import { LuListVideo } from 'react-icons/lu';
import { useSettingsContext } from '../../../../context/SettingsContext';
import { useMemo } from 'react';
import VisualizerBackdrop from './VisualizerBackdrop';

interface Props {
  video: YoutubeVideoDetail;
  playerStatus: PlayerStatus;
  host: HostData;
  playerControls: PlayerControls;
  queue: QueueData;
  queueControls: QueueControls;
  onOpenQueue: () => void;
  timeTimestamp: number;
}

const VisualizerLandscapeMode = ({ video, queue, queueControls, playerStatus, playerControls, host, onOpenQueue, timeTimestamp }: Props) => {
  const { hostStatus } = useMobileAuthContext();
  const { settings } = useSettingsContext();
  const { colorMode } = useColorMode();
  const [glassMode] = useMemo(() => {
    if (settings.appearance.glassMode) return [settings.appearance.glassMode, 'white'];
    return [settings.appearance.glassMode, 'text.500'];
  }, [settings.appearance.glassMode, colorMode]);
  return (
    <Flex
      height='100%'
      width='100%'
      className='visualizer'
      position='relative'
      grow={1}
      justifyContent='center'
      alignItems='center'
      borderTop='1px solid'
      borderColor='borders.100'
      marginTop='-1px'
    >
      <VisualizerBackdrop src={`https://i.ytimg.com/vi/${video.id}/0.jpg`} />
      <Flex position='relative' height='100%' width='100%' direction='column' justifyContent='space-between' alignItems='center'>
        <Flex
          justifyContent='space-between'
          alignItems='center'
          width='100%'
          bgGradient={glassMode ? 'linear(180deg, blackAlpha.400 , transparent 90%)' : 'none'}
        >
          <Flex alignItems='center' padding={2} gap={3}>
            <Image boxShadow='md' aspectRatio='1/1' width='1.5rem' height='1.5rem' objectFit='cover' src={video.channelThumbnail} rounded='full' />
            <Text noOfLines={1} textShadow='md'>
              {video.title}
            </Text>
          </Flex>
          <VisualizerHostBadge host={host} bgGradient='none' position='relative' width='auto' gap={'3px'} direction='row' wrap='wrap' />
        </Flex>
        <Flex position='relative' flexGrow={1} width='100%' justifyContent='center' overflow='hidden'>
          <Image
            boxShadow='lg'
            aspectRatio='16/9'
            maxHeight='90%'
            margin={2}
            width='auto'
            borderRadius={'lg'}
            objectFit='cover'
            src={`https://i.ytimg.com/vi/${video.id}/0.jpg`}
          ></Image>
          <VisualizerControlsOverlay status={playerStatus} controls={playerControls} backgroundType='gradient' />
          <IconButton
            zIndex={5}
            size='lg'
            position='absolute'
            margin='auto'
            top={0}
            bottom={0}
            background='bgAlpha.100'
            color='text.300'
            colorScheme='black'
            border='1px solid'
            borderColor='borders.100'
            variant='solid'
            right={0}
            minWidth='6rem'
            minHeight='4rem'
            borderLeftRadius='lg'
            borderRightRadius={0}
            icon={<Icon as={LuListVideo} boxSize='1.75rem' />}
            aria-label='queue'
            marginLeft='auto'
            onClick={onOpenQueue}
          />
        </Flex>
        <Box width='100%' paddingX={2} paddingBottom={4}>
          <Flex justifyContent='stretch' alignSelf='stretch' paddingX={5}>
            <PlayerTrack
              margin={0}
              status={playerStatus}
              onTimeChange={playerControls.onTimeChange}
              currentQueuedVideo={queue.currentItem?.video}
              hostStatus={hostStatus}
              timeTimestamp={timeTimestamp}
            />
          </Flex>
          <VisualizerControls status={playerStatus} controls={playerControls} queueControls={queueControls} />
        </Box>
      </Flex>
    </Flex>
  );
};

export default VisualizerLandscapeMode;

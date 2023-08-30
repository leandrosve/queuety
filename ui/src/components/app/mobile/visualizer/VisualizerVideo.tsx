import { Box, Flex, Image, Stack, Text } from '@chakra-ui/react';
import './visualizer.css';
import { YoutubeVideoDetail } from '../../../../services/api/YoutubeService';
import PlayerStatus from '../../../../model/player/PlayerStatus';
import VisualizerControlsOverlay from './VisualizerControlsOverlay';
import { PlayerControls } from '../../../../hooks/player/useDesktopPlayer';
import VisualizerBackdrop from './VisualizerBackdrop';
import HostData from '../../../../model/auth/HostData';
import { useMemo } from 'react';
import FormatUtils from '../../../../utils/FormatUtils';
import { PiScreencastFill } from 'react-icons/pi';
import { useTranslation } from 'react-i18next';

interface Props {
  video: YoutubeVideoDetail;
  status: PlayerStatus;
  host: HostData;
  playerControls: PlayerControls;
}
const VisualizerVideo = ({ video, status, playerControls, host }: Props) => {
  const { t } = useTranslation();

  const hostColor = useMemo(() => FormatUtils.getColorForNickname(host.nickname), [host]);
  if (!video) return <VisualizerPlaceholder />;
  return (
    <Stack align='center' spacing={0} width='100%'>
      <Flex className='visualizer' position='relative' width='100%' aspectRatio='16/9' justifyContent='center' alignItems='center'>
        <Box borderRadius='md' aspectRatio='16/9' width='90%' margin={'5px'} boxShadow='xl' position='relative'>
          <Image aspectRatio='16/9' width='100%' objectFit='cover' src={`https://i.ytimg.com/vi/${video.id}/0.jpg`} borderRadius='md'></Image>
          <VisualizerControlsOverlay status={status} controls={playerControls} />
          <Flex position='absolute' top={0} gap={2} padding={2} paddingBottom={7} bgGradient='linear(to-b, blackAlpha.700, transparent)' width='100%'>
            <Image
              boxShadow='md'
              aspectRatio='1/1'
              width='1.5rem'
              height='1.5rem'
              opacity={1}
              objectFit='cover'
              src={video.channelThumbnail}
              rounded='full'
            />
            <Text noOfLines={1} textShadow='md' color='white'>
              {video.title}
            </Text>
          </Flex>
          <Flex
            direction='column'
            position='absolute'
            bottom={0}
            fontSize='xs'
            justifyContent='center'
            alignItems='center'
            padding={2}
            width='100%'
            textShadow='0px 1px 3px grey'
            bgGradient='linear(to-t, blackAlpha.700, transparent)'
            color='white'
          >
            <Flex alignItems='center' gap={2}>
              <Text>{t('player.playingInDesktop')}</Text>
            </Flex>
            <Flex alignItems='center' position='relative' color='white' zIndex={1}>
              <Box height='100%' width='100%' opacity='.7' position='absolute' backgroundColor={`${hostColor}.500`} borderRadius='md' zIndex={-1} />
              <Flex alignItems='center' paddingX={2} gap={1}>
                <PiScreencastFill />
                <Text as='span'>{host.nickname}</Text>
              </Flex>
            </Flex>
          </Flex>
        </Box>
      </Flex>
      <VisualizerBackdrop src={video.thumbnail} />
    </Stack>
  );
};

const VisualizerPlaceholder = () => (
  <Flex className='visualizer' position='relative' width='100vw' aspectRatio='16/9' justifyContent='center' alignItems='center'>
    <Flex
      justifyContent='center'
      alignItems='center'
      borderRadius='md'
      aspectRatio='16/9'
      width='90%'
      margin={'5px'}
      opacity={0.85}
      objectFit='cover'
      boxShadow='xl'
    >
      <Text>Awaiting</Text>
    </Flex>
  </Flex>
);

export default VisualizerVideo;

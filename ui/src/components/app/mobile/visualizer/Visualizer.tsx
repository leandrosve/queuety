import { Box, Button, Flex, Image, Stack, Text } from '@chakra-ui/react';
import './visualizer.css';
import PlayerControls from '../../shared/player/controls/PlayerControls';
import VisualizerControls from './VisualizerControls';
import MobileQueue from '../queue/MobileQueue';
import PlayerSearch from '../../shared/player/search/PlayerSearch';
import { BsSearch } from 'react-icons/bs';
import { useTranslation } from 'react-i18next';
import PlayerTrack from '../../shared/player/controls/PlayerTrack';
import PlayerState from '../../../../model/player/PlayerState';
import DraggableSnackbar from '../queue/DraggableSnackbar';

const Visualizer = () => {
  const { t } = useTranslation();
  return (
    <Flex direction='column' alignItems='center' justifyContent='start' alignSelf='stretch' gap={3}>
      <Button display='flex' alignSelf='stretch' justifyContent='start' gap={5} onClick={() => {}} marginX={4}>
        <BsSearch />
        <Text as='span'>{t('playerSearch.pasteUrl')}</Text>
      </Button>
      <Flex className='visualizer' position='relative' width='100vw' aspectRatio='16/9' justifyContent='center' alignItems='center'>
        <Image
          borderRadius='md'
          aspectRatio='16/9'
          width='90%'
          margin={'5px'}
          opacity={0.85}
          objectFit='cover'
          boxShadow='xl'
          src='https://img.youtube.com/vi/K69tbUo3vGs/sddefault.jpg'
        ></Image>
        <Box className='visualizer-backdrop'>
          <Image className='visualizer-backdrop-image' src='https://img.youtube.com/vi/K69tbUo3vGs/sddefault.jpg' />
          <Box className='visualizer-backdrop-blur' />
        </Box>
      </Flex>
      <VisualizerControls state={1} onPlay={() => {}} onForward={() => {}} onPause={() => {}} onRewind={() => {}} playbackRate={1} />

      <Flex justifyContent='stretch' alignSelf='stretch' paddingX={5}>
        <PlayerTrack duration={100} onTimeChange={() => {}} playbackRate={1} state={PlayerState.PAUSED} />
      </Flex>
      <Flex grow={1}>

      </Flex>
        <MobileQueue />
    </Flex>
  );
};

export default Visualizer;

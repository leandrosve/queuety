import { Flex, Icon, IconButton, Spinner, Stack, Text } from '@chakra-ui/react';
import './visualizer.css';
import { useEffect, useState } from 'react';
import { BsFastForwardFill, BsPauseFill, BsPlayFill } from 'react-icons/bs';
import { motion } from 'framer-motion';
import PlayerStatus from '../../../../model/player/PlayerStatus';
import PlayerState from '../../../../model/player/PlayerState';
import { PlayerControls } from '../../../../hooks/player/useDesktopPlayer';

interface Props {
  status: PlayerStatus;
  controls: PlayerControls;
}

const getPlayerStateIcon = (state: PlayerState) => {
  if (state === PlayerState.PLAYING) return BsPauseFill;
  return BsPlayFill;
};

const VisualizerControlsOverlay = ({ status, controls }: Props) => {
  const [clicked, setClicked] = useState(false);
  const [tapLeft, setTapLeft] = useState(0);

  const onDoubleTapLeft = () => {
    setTapLeft((prev) => prev + 1);
  };

  useEffect(() => {
    const timeout = setTimeout(() => setClicked(false), 2000);
    return () => clearTimeout(timeout);
  }, [clicked]);

  useEffect(() => {
    const timeout = setTimeout(() => setTapLeft(0), 1000);
    return () => clearTimeout(timeout);
  }, [tapLeft]);

  return (
    <Flex
      onClick={() => setClicked(true)}
      position='absolute'
      height='100%'
      top={0}
      zIndex={2}
      width='100%'
      opacity={clicked ? 1 : 0}
      background='blackAlpha.500'
      transition='opacity 400ms'
    >
      <motion.div onDoubleClick={onDoubleTapLeft} className='visualizer-overlay-left' style={{ opacity: tapLeft ? 1 : 0 }}>
        <Stack align='center'>
          <Icon as={BsFastForwardFill} boxSize='2rem' transform='rotate(180deg)' />
          <Text opacity={tapLeft ? 1 : 0}>{`-${tapLeft * 10} secs`}</Text>
        </Stack>
        <Flex
          position='absolute'
          height='100%'
          width='120%'
          zIndex={-1}
          top={0}
          left={0}
          pointerEvents='none'
          background='whiteAlpha.300'
          borderRightRadius={'40%'}
        ></Flex>
      </motion.div>
      <Flex height={'100%'} width='20%' position='relative' alignItems='center' justifyContent='center'>
        {status.state == PlayerState.BUFFERING ? (
          <Spinner color='white' />
        ) : (
          <IconButton
            aria-label='toggle play'
            icon={<Icon as={getPlayerStateIcon(status.state)} fill='white' stroke='white' boxSize='3rem' />}
            onClick={status.state == PlayerState.PLAYING ? controls.onPause : controls.onPlay}
          />
        )}
      </Flex>
      <Flex height={'100%'} width='40%' alignItems='center' opacity={0} justifyContent='center'>
        <Icon as={BsFastForwardFill} boxSize='2rem' />
      </Flex>
    </Flex>
  );
};

export default VisualizerControlsOverlay;

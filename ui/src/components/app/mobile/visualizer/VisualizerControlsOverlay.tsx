import { Flex, Icon, IconButton, Spinner, Text } from '@chakra-ui/react';
import './visualizer.css';
import { useEffect, useState } from 'react';
import { BsPauseFill, BsPlayFill } from 'react-icons/bs';
import PlayerStatus from '../../../../model/player/PlayerStatus';
import PlayerState from '../../../../model/player/PlayerState';
import { PlayerControls } from '../../../../hooks/player/useDesktopPlayer';
import { LuRotateCcw, LuRotateCw } from 'react-icons/lu';

interface Props {
  status: PlayerStatus;
  controls: PlayerControls;
}

const getPlayerStateIcon = (state: PlayerState) => {
  if (state === PlayerState.PLAYING) return BsPauseFill;
  return BsPlayFill;
};

const VisualizerControlsOverlay = ({ status, controls }: Props) => {
  const [clicked, setClicked] = useState(0);
  const [rewindSeconds, setRewindSeconds] = useState(0);
  const [forwardSeconds, setForwardSeconds] = useState(0);

  const onRewind = () => {
    setClicked((p) => p + 1);
    setRewindSeconds((p) => p + 10);
  };
  const onForward = () => {
    setClicked((p) => p + 1);
    setForwardSeconds((p) => p + 10);
  };
  useEffect(() => {
    const timeout = setTimeout(() => setClicked(0), 3000);
    return () => clearTimeout(timeout);
  }, [clicked]);

  useEffect(() => {
    let timeout: number;
    if (rewindSeconds > 0) {
      timeout = setTimeout(() => {
        controls.onRewind(rewindSeconds);
        setRewindSeconds(0);
        setClicked(0);
      }, 800);
    }
    return () => clearTimeout(timeout);
  }, [rewindSeconds]);

  useEffect(() => {
    let timeout: number;
    if (forwardSeconds > 0) {
      timeout = setTimeout(() => {
        controls.onForward(forwardSeconds);
        setForwardSeconds(0);
        setClicked(0);
      }, 800);
    }
    return () => clearTimeout(timeout);
  }, [forwardSeconds]);

  return (
    <Flex
      onClick={() => setClicked((p) => p + 1)}
      onMouseEnter={() => setClicked((p) => p + 1)}
      position='absolute'
      height='100%'
      top={0}
      zIndex={2}
      width='100%'
      opacity={clicked ? 1 : 0}
      background='blackAlpha.500'
      transition='opacity 400ms'
    >
      <Flex width='100%' height='100%' pointerEvents={clicked ? 'all' : 'none'} color='white'>
        <Flex height={'100%'} width='40%' direction='column' alignItems='center' justifyContent='center'>
          <Flex position='relative'>
            <IconButton rounded='full' color='white' aria-label='rewind' icon={<Icon as={LuRotateCcw} boxSize='2rem' />} onClick={onRewind} />
            <Text position='absolute' left='50%' transform={'translateX(-50%)'} bottom={'-1rem'} fontSize='xs' opacity={rewindSeconds ? 1 : 0}>
              -{rewindSeconds}s
            </Text>
          </Flex>
        </Flex>
        <Flex height={'100%'} width='20%' position='relative' alignItems='center' justifyContent='center'>
          {status.state == PlayerState.BUFFERING ? (
            <Spinner color='white' />
          ) : (
            <IconButton
              aria-label='toggle play'
              rounded='full'
              icon={<Icon as={getPlayerStateIcon(status.state)} fill='white' stroke='white' boxSize='3rem' />}
              onClick={status.state == PlayerState.PLAYING ? controls.onPause : controls.onPlay}
            />
          )}
        </Flex>
        <Flex height={'100%'} width='40%' direction='column' alignItems='center' justifyContent='center'>
          <Flex position='relative'>
            <IconButton rounded='full' color='white' aria-label='fast-forward' icon={<Icon as={LuRotateCw} boxSize='2rem' />} onClick={onForward} />
            <Text position='absolute' left='50%' transform={'translateX(-50%)'} bottom={'-1rem'} fontSize='xs' opacity={forwardSeconds ? 1 : 0}>
              +{forwardSeconds}s
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default VisualizerControlsOverlay;

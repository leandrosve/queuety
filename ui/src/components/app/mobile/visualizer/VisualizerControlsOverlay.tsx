import { Box, Flex, Icon, Image, Stack, Text } from '@chakra-ui/react';
import './visualizer.css';
import { useEffect, useState } from 'react';
import { LuPlay, LuSkipBack } from 'react-icons/lu';
import { BsFastForwardFill } from 'react-icons/bs';
import { motion } from 'framer-motion';

const VisualizerControlsOverlay = () => {
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
      zIndex={1}
      width='100%'
      opacity={clicked ? 1 : 1}
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
        <Icon as={LuPlay} fill='white' stroke='white' boxSize='3rem' />
      </Flex>
      <Flex height={'100%'} width='40%' alignItems='center' justifyContent='center'>
        <Icon as={BsFastForwardFill} boxSize='2rem' />
      </Flex>
    </Flex>
  );
};

export default VisualizerControlsOverlay;

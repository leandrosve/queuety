import { useState, useEffect } from 'react';
import { Flex } from '@chakra-ui/react';
import './playerQueue.css';
import { usePlayerStatusContext } from '../../../../../context/PlayerStatusContext';
import PlayerState from '../../../../../model/player/PlayerState';

const PlayerQueueItemProgressBar = ({ duration }: { duration: number }) => {
  const [time, setTime] = useState(0);

  const { status } = usePlayerStatusContext();

  const { state, currentTime, playbackRate } = status;
  const percentage = (time / duration) * 100;

  useEffect(() => setTime(currentTime || 0), [currentTime]);

  useEffect(() => {
    let interval: number;
    if (state === PlayerState.PLAYING) {
      interval = setInterval(() => {
        setTime((p) => p + 1 * playbackRate);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [state, currentTime, playbackRate]);
  return (
    <Flex
      as='span'
      width={'100%'}
      height='3px'
      background='red.100'
      position='absolute'
      bottom='0'
      left={0}
    >
      <Flex
        as='span'
        width={`${percentage}%`}
        height='100%'
        position='absolute'
        bottom={0}
        left={0}
        background='red.500'
        minWidth='3px'
      ></Flex>
    </Flex>
  );
};

export default PlayerQueueItemProgressBar;

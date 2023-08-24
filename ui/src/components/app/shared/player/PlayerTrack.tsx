import { Flex, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Text, Tooltip } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import PlayerState from '../../../../model/player/PlayerState';
import FormatUtils from '../../../../utils/FormatUtils';

interface Props {
  duration: number;
  onTimeChange: (time: number) => void;
  currentTime?: number; // Seconds
  playbackRate: number; // Seconds
  state: PlayerState;
}
const PlayerTrack = ({ duration, onTimeChange, currentTime, playbackRate, state }: Props) => {
  const [time, setTime] = useState(currentTime || 0);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [draggingValue, setDraggingValue] = useState(currentTime || 0);

  const handleChangeEnd = (value: number) => {
    setTime(value);
    setIsDragging(false);
    onTimeChange(value);
    setShowTooltip(false);
  };
  useEffect(() => setTime(currentTime || 0), [currentTime]);

  useEffect(() => {
    let interval: number;
    let lastTime = new Date().getTime();
    if (state === PlayerState.PLAYING) {
      interval = setInterval(() => {
        //setTime((p) => p + 0.1 * playbackRate);
        const currentTime = new Date().getTime();
        const timeDiff = (currentTime - lastTime) / 1000; // To seconds
        lastTime = currentTime;
        console.log(playbackRate);
        setTime((p) => p + timeDiff * playbackRate);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [state, playbackRate]);

  return (
    <Flex direction='column' alignItems='center' gap={1} width='100%' mt={2}>
      <Slider
        aria-label='slider-ex-4'
        defaultValue={30}
        focusThumbOnChange={false}
        max={duration}
        onChange={(v) => setDraggingValue(v)}
        onChangeEnd={handleChangeEnd}
        onChangeStart={() => {
          setIsDragging(true);
          setShowTooltip(true);
        }}
        colorScheme='primary'
        value={isDragging ? draggingValue : time}
      >
        <SliderTrack height='8px' boxShadow='base'>
          <SliderFilledTrack />
        </SliderTrack>
        <Tooltip
          hasArrow
          bg='bgAlpha.100'
          color='text.500'
          placement='top'
          isOpen={showTooltip}
          label={FormatUtils.formatDuration(isDragging ? draggingValue : time)}
        >
          <SliderThumb opacity={0} pointerEvents={'none'} />
        </Tooltip>
      </Slider>
      <Flex justifyContent='space-between' alignSelf='stretch' fontSize='sm'>
        <Text as='span'>{FormatUtils.formatDuration(isDragging ? draggingValue : time)}</Text>
        <Text as='span'>{FormatUtils.formatDuration(duration)}</Text>
      </Flex>
    </Flex>
  );
};

export default PlayerTrack;

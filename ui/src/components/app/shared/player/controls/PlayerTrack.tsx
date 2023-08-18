import { Flex, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Text, Tooltip } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import FormatUtils from '../../../../../utils/FormatUtils';
import PlayerState from '../../../../../model/player/PlayerState';

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
  };
  useEffect(() => setTime(currentTime || 0), [currentTime]);

  useEffect(() => {
    let interval: number;
    if (state === PlayerState.PLAYING) {
      interval = setInterval(() => {
        setTime((p) => p + 0.1 * playbackRate);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [state, playbackRate]);

  return (
    <Flex direction='column' alignItems='center' gap={1} width='100%'>
      <Slider
        aria-label='slider-ex-4'
        defaultValue={30}
        focusThumbOnChange={false}
        max={duration}
        onChange={(v) => setDraggingValue(v)}
        onChangeEnd={handleChangeEnd}
        onChangeStart={() => setIsDragging(true)}
        colorScheme='primary'
        value={isDragging ? draggingValue : time}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <SliderTrack height='8px'>
          <SliderFilledTrack />
        </SliderTrack>
        <Tooltip
          hasArrow
          bg='bgAlpha.100'
          color='white'
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

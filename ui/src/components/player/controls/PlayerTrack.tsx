import { Flex, Icon, IconButton, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Text, Tooltip } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import FormatUtils from '../../../utils/FormatUtils';
import { BsFillPlayFill, BsPauseFill, BsSkipEndFill, BsSkipStartFill } from 'react-icons/bs';
import { TbRewindBackward10, TbRewindForward10 } from 'react-icons/tb';
import { usePlayerQueueContext } from '../../../context/PlayerQueueContext';
import PlayerControls from './PlayerControls';

interface Props {
  duration: number;
  onTimeChange: (time: number) => void;
  currentTime?: number; // Seconds
  playbackRate: number; // Seconds

  state: YT.PlayerState;
  onPlay: () => void;
  onPause: () => void;

  onForward: (seconds: number) => void;
  onRewind: (seconds: number) => void;
}
const PlayerTrack = ({ duration, onTimeChange, currentTime, playbackRate, state, onPlay, onPause, onForward, onRewind }: Props) => {
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
    let interval: NodeJS.Timer;
    if (state === YT.PlayerState.PLAYING) {
      interval = setInterval(() => {
        setTime((p) => p + 0.1 * playbackRate);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [state, playbackRate]);

  return (
    <Flex direction='column' alignItems='center' gap={3}>
      <PlayerControls state={state} playbackRate={playbackRate} onPlay={onPlay} onPause={onPause} onForward={onForward} onRewind={onRewind} />
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
      <Flex justifyContent='space-between' alignSelf='stretch'>
        <Text as='span'>{FormatUtils.formatDuration(isDragging ? draggingValue : time)}</Text>
        <Text as='span'>{FormatUtils.formatDuration(duration)}</Text>
      </Flex>
    </Flex>
  );
};

export default PlayerTrack;

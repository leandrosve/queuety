import { Flex, FlexProps, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Text, Tooltip } from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import PlayerState from '../../../../model/player/PlayerState';
import FormatUtils from '../../../../utils/FormatUtils';
import PlayerStatus from '../../../../model/player/PlayerStatus';
import { YoutubeVideoDetail } from '../../../../services/api/YoutubeService';
import { HostStatus } from '../../../../hooks/connection/useMobileAuth';

interface Props extends FlexProps {
  onTimeChange: (time: number) => void;
  status: PlayerStatus;
  hostStatus?: HostStatus;
  currentQueuedVideo?: YoutubeVideoDetail;
  timeTimestamp: number;
}
const getInitialTime = (time: number, timestamp: number, rate: number) => {
  console.log({ time, timestamp, rate });
  return time + ((new Date().getTime() - timestamp )/ 1000) * rate;
};
const PlayerTrack = ({ onTimeChange, status, currentQueuedVideo, hostStatus, timeTimestamp, ...props }: Props) => {
  const { currentTime, duration, rate, state } = useMemo(() => {
    if (currentQueuedVideo && currentQueuedVideo?.id !== status.videoId) {
      console.log('AAAA');
      return {
        currentTime: 0,
        duration: currentQueuedVideo.duration,
        state: PlayerState.BUFFERING,
        videoId: currentQueuedVideo.id,
        rate: status.rate,
      };
    }

    return {
      ...status,
      currentTime: getInitialTime(status.currentTime, timeTimestamp, status.rate),
    };
  }, [status, currentQueuedVideo, timeTimestamp]);

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
    const hostConnected = hostStatus && hostStatus == HostStatus.CONNECTED;
    const awaiting = state === PlayerState.AWAITING_PLAYING || state === PlayerState.AWAITING_PAUSED;
    if (!awaiting && hostConnected && state === PlayerState.PLAYING) {
      interval = setInterval(() => {
        //setTime((p) => p + 0.1 * playbackRate);
        const currentTime = new Date().getTime();
        const timeDiff = (currentTime - lastTime) / 1000; // To seconds
        lastTime = currentTime;

        setTime((p) => {
          return p + timeDiff * rate;
        });
      }, 1000 / rate);
    }
    return () => clearInterval(interval);
  }, [state, rate, hostStatus]);

  return (
    <Flex direction='column' alignItems='center' gap={1} width='100%' mt={2} {...props}>
      <Slider
        aria-label='slider-ex-4'
        defaultValue={30}
        isDisabled={hostStatus === HostStatus.DISCONNECTED}
        focusThumbOnChange={false}
        step={1}
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
        <SliderTrack height='8px' boxShadow='base' _light={{ background: 'white' }}>
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

import { Flex, Icon, IconButton, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Spinner } from '@chakra-ui/react';
import { LuVolume1, LuVolume2, LuVolumeX } from 'react-icons/lu';
import { useState, useEffect } from 'react';
import GlassModal from '../../../common/glass/GlassModal';
import { useMobileAuthContext } from '../../../../context/MobileAuthContext';
import { HostStatus } from '../../../../hooks/connection/useMobileAuth';

interface Props {
  volume: number;
  onChangeVolume: (value: number) => void;
}

const getVolumeIcon = (volume: number) => {
  if (volume <= 0) return LuVolumeX;
  if (volume >= 100) return LuVolume2;
  return LuVolume1;
};
const VisualizerSoundMenu = ({ volume, onChangeVolume }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const { hostStatus } = useMobileAuthContext();
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState({ prev: volume, current: volume });
  const [draggingValue, setDraggingValue] = useState<number | null>(null);

  const onChangeEnd = (val: number) => {
    setDraggingValue(null);
    setValue((p) => ({ prev: p.current, current: val }));
    if (hostStatus == HostStatus.DISCONNECTED) return;
    setLoading(true);
    onChangeVolume(val);
  };

  const onToggleMute = (mute: boolean) => {
    const prev = value.prev;
    if (mute) {
      setValue((p) => ({ prev: p.current, current: 0 }));
    } else {
      setValue({ prev: 0, current: prev });
    }
    onChangeVolume(mute ? 0 : prev);
  };

  useEffect(() => {
    setValue((p) => ({ prev: p.current != volume ? p.current : p.prev, current: volume }));
    setLoading(false);
  }, [volume]);

  return (
    <>
      <IconButton
        variant='ghost'
        className='volume-trigger'
        id='volume-trigger'
        icon={loading ? <Spinner size='sm' /> : <Icon as={value.current > 0 ? LuVolume1 : LuVolumeX} boxSize={4} />}
        aria-label='sound'
        color='text.300'
        onClick={() => setIsOpen(true)}
      />
      <GlassModal isOpen={isOpen} onClose={() => setIsOpen(false)} isCentered contentProps={{ padding: 0 }} maxWidth='95vw'>
        <Flex alignItems='center' justifyContent='center' padding={2} gap={3}>
          <IconButton
            variant='ghost'
            icon={<Icon as={getVolumeIcon(value.current)} boxSize={5} />}
            aria-label='sound'
            isDisabled={hostStatus === HostStatus.DISCONNECTED}
            padding={1}
            color='text.300'
            onClick={() => onToggleMute(value.current > 0)}
          />
          <Slider
            value={draggingValue !== null ? draggingValue : value.current}
            aria-label='slider-ex-1'
            min={0}
            isDisabled={hostStatus === HostStatus.DISCONNECTED}
            max={100}
            step={10}
            onChange={(v) => setDraggingValue(v)}
            onChangeEnd={onChangeEnd}
            minW={2}
            colorScheme='primary'
          >
            <SliderTrack width='.4rem'>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
        </Flex>
      </GlassModal>
    </>
  );
};

export default VisualizerSoundMenu;

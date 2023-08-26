import { Flex, Heading, Icon, IconButton, ModalHeader, Slider, SliderFilledTrack, SliderThumb, SliderTrack } from '@chakra-ui/react';
import { LuVolume1, LuVolumeX } from 'react-icons/lu';
import { useState, useEffect } from 'react';
import GlassModal from '../../../common/glass/GlassModal';

interface Props {
  volume: number;
  onChangeVolume: (value: number) => void;
}
const VisualizerSoundMenu = ({ volume, onChangeVolume }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState({ prev: volume, current: volume });
  const [draggingValue, setDraggingValue] = useState<number | null>(volume);

  const onChangeEnd = (val: number) => {
    setDraggingValue(null);
    setLoading(true);
    setValue((p) => ({ prev: p.current, current: val }));
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
        icon={<Icon as={value.current > 0 ? LuVolume1 : LuVolumeX} boxSize={4} />}
        aria-label='sound'
        color='text.300'
        onClick={() => setIsOpen(true)}
        isLoading={loading}
      />
      <GlassModal isOpen={isOpen} onClose={() => setIsOpen(false)} title='Volume' isCentered contentProps={{ padding: 0 }} maxWidth='95vw'>
        <Flex alignItems='center' justifyContent='center' paddingRight={4} gap={3}>
          <IconButton
            variant='ghost'
            icon={<Icon as={value.current > 0 ? LuVolume1 : LuVolumeX} boxSize={4} />}
            aria-label='sound'
            color='text.300'
            onClick={() => onToggleMute(value.current > 0)}
          />
          <Slider
            value={draggingValue !== null ? draggingValue : value.current}
            aria-label='slider-ex-1'
            defaultValue={1}
            min={0}
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

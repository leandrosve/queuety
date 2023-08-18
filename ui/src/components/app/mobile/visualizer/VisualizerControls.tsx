import { ButtonGroup, Flex, Icon, IconButton } from '@chakra-ui/react';
import { BsFillPlayFill, BsPauseFill, BsSkipEndFill, BsSkipStartFill } from 'react-icons/bs';
import { TbRewindBackward10, TbRewindForward10 } from 'react-icons/tb';
import PlayerState from '../../../../model/player/PlayerState';

interface Props {
  playbackRate: number; // Seconds
  state: number;
  onPlay: () => void;
  onPause: () => void;
  onForward: (seconds: number) => void;
  onRewind: (seconds: number) => void;
}

const buttonWidth = '5rem';
const VisualizerControls = ({ state, onPlay, onPause }: Props) => {
  return (
    <ButtonGroup variant='ghost' borderRadius='md'>
      <IconButton icon={<Icon as={BsSkipStartFill} boxSize={5} />} aria-label='skip forward' width={buttonWidth} />
      <IconButton
        width={buttonWidth}
        onClick={() => {
          state != PlayerState.PLAYING ? onPlay() : onPause();
        }}
        icon={<Icon as={state != PlayerState.PLAYING ? BsFillPlayFill : BsPauseFill} boxSize={7} />}
        aria-label={state != PlayerState.PLAYING ? 'play' : 'pause'}
      >
        Toggle Play
      </IconButton>
      <IconButton width={buttonWidth} icon={<Icon as={BsSkipEndFill} boxSize={5} />} aria-label='skip forward' />
    </ButtonGroup>
  );
};

export default VisualizerControls;

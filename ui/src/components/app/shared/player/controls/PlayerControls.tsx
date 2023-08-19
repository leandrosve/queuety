import { ButtonGroup, Flex, Icon, IconButton } from '@chakra-ui/react';
import { BsFillPlayFill, BsPauseFill, BsSkipEndFill, BsSkipStartFill } from 'react-icons/bs';
import { TbRewindBackward10, TbRewindForward10 } from 'react-icons/tb';
import PlayerState from '../../../../../model/player/PlayerState';

interface Props {
  playbackRate: number; // Seconds
  state: number;
  onPlay: () => void;
  onPause: () => void;
  onForward: (seconds: number) => void;
  onRewind: (seconds: number) => void;
  onPrevious: () => void;
  onNext: () => void;
}

const buttonWidth = '5rem';
const PlayerControls = ({ state, onPlay, onPause, onForward, onRewind, onPrevious, onNext }: Props) => {
  return (
    <ButtonGroup
      isAttached
      borderStyle='solid '
      variant='ghost'
      alignSelf='start'
      borderRadius='md'
      borderColor='borders.100'
      background='whiteAlpha.100'
      _dark={{ borderWidth: '1px' }}
      _light={{ background: 'blackAlpha.100' }}
    >
      <IconButton
        icon={<Icon as={BsSkipStartFill} boxSize={5} />}
        aria-label='skip forward'
        width={buttonWidth}
        borderRadius='none'
        onClick={onPrevious}
      />
      <IconButton icon={<Icon as={TbRewindBackward10} boxSize={5} />} aria-label='rewind' width={buttonWidth} onClick={() => onRewind(10)} />
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
      <IconButton width={buttonWidth} icon={<Icon as={TbRewindForward10} boxSize={5} />} aria-label='rewind forward' onClick={() => onForward(10)} />
      <IconButton width={buttonWidth} icon={<Icon as={BsSkipEndFill} boxSize={5} />} aria-label='skip forward' onClick={onNext} />
    </ButtonGroup>
  );
};

export default PlayerControls;

import { Flex, Icon, IconButton } from '@chakra-ui/react';
import { BsFillPlayFill, BsPauseFill, BsSkipEndFill, BsSkipStartFill } from 'react-icons/bs';
import { TbRewindBackward10, TbRewindForward10 } from 'react-icons/tb';
import { usePlayerQueueContext } from '../../../../../context/PlayerQueueContext';

interface Props {
  playbackRate: number; // Seconds
  state: YT.PlayerState;
  onPlay: () => void;
  onPause: () => void;
  onForward: (seconds: number) => void;
  onRewind: (seconds: number) => void;
}
const PlayerControls = ({ state, onPlay, onPause, onForward, onRewind }: Props) => {
  const { goNext, goPrevious } = usePlayerQueueContext();

  return (
    <Flex gap='30px'>
      <IconButton
        rounded='full'
        icon={<Icon as={BsSkipStartFill} boxSize={5} />}
        aria-label='skip forward'
        variant='ghost'
        onClick={() => goPrevious()}
      />
      <IconButton
        rounded='full'
        icon={<Icon as={TbRewindBackward10} boxSize={5} />}
        aria-label='rewind'
        variant='ghost'
        onClick={() => onRewind(10)}
      />
      <IconButton
        rounded='full'
        variant='ghost'
        onClick={() => {
          state != YT.PlayerState.PLAYING ? onPlay() : onPause();
        }}
        icon={<Icon as={state != YT.PlayerState.PLAYING ? BsFillPlayFill : BsPauseFill} boxSize={7} />}
        aria-label={state != YT.PlayerState.PLAYING ? 'play' : 'pause'}
      >
        Toggle Play
      </IconButton>
      <IconButton
        rounded='full'
        icon={<Icon as={TbRewindForward10} boxSize={5} />}
        aria-label='rewind forward'
        variant='ghost'
        onClick={() => onForward(10)}
      />
      <IconButton rounded='full' icon={<Icon as={BsSkipEndFill} boxSize={5} />} aria-label='skip forward' variant='ghost' onClick={() => goNext()} />
    </Flex>
  );
};

export default PlayerControls;

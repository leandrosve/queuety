import { ButtonGroup, Flex, Icon, IconButton } from '@chakra-ui/react';
import { BsFillPlayFill, BsPauseFill, BsSkipEndFill, BsSkipStartFill } from 'react-icons/bs';
import { TbRewindBackward10, TbRewindForward10 } from 'react-icons/tb';
import PlayerState from '../../../../../model/player/PlayerState';
import { QueueControls } from '../../../../../hooks/queue/useDesktopQueue';

interface Props {
  playbackRate: number; // Seconds
  state: number;
  queueControls: QueueControls;
}

const buttonWidth = '5rem';
const PlayerControls = ({ state, queueControls }: Props) => {
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
        aria-label='skip backwards'
        width={buttonWidth}
        borderRadius='none'
        onClick={queueControls.onSkipBack}
      />
      <IconButton icon={<Icon as={TbRewindBackward10} boxSize={5} />} aria-label='rewind' width={buttonWidth} onClick={() => console.log('rewind')} />
      <IconButton
        width={buttonWidth}
        onClick={() => {
          state != PlayerState.PLAYING ? console.log('play') : console.log('pause');
        }}
        icon={<Icon as={state != PlayerState.PLAYING ? BsFillPlayFill : BsPauseFill} boxSize={7} />}
        aria-label={state != PlayerState.PLAYING ? 'play' : 'pause'}
      >
        Toggle Play
      </IconButton>
      <IconButton
        width={buttonWidth}
        icon={<Icon as={TbRewindForward10} boxSize={5} />}
        aria-label='rewind forward'
        onClick={() => console.log('roll it')}
      />
      <IconButton width={buttonWidth} icon={<Icon as={BsSkipEndFill} boxSize={5} />} aria-label='skip forward' onClick={queueControls.onSkip} />
    </ButtonGroup>
  );
};

export default PlayerControls;

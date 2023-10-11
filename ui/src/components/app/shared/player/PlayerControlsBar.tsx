import { ButtonGroup, Icon, IconButton, useMediaQuery } from '@chakra-ui/react';
import { BsFillPlayFill, BsPauseFill, BsSkipEndFill, BsSkipStartFill } from 'react-icons/bs';
import { TbRewindBackward10, TbRewindForward10 } from 'react-icons/tb';
import PlayerState from '../../../../model/player/PlayerState';
import { QueueControls } from '../../../../hooks/queue/useQueue';
import { PlayerControls } from '../../../../hooks/player/useDesktopPlayer';
import PlayerStatus from '../../../../model/player/PlayerStatus';
import { useMemo } from 'react';
import { LuMaximize } from 'react-icons/lu';

interface Props {
  status: PlayerStatus;
  queueControls: QueueControls;
  playerControls: PlayerControls;
}

const PlayerControlsBar = ({ queueControls, playerControls, status }: Props) => {
  const [mobileScreen] = useMediaQuery('(max-width: 500px)');

  const buttonWidth = useMemo(() => (mobileScreen ? '3.5rem' : '5rem'), [mobileScreen]);
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
      <IconButton
        icon={<Icon as={TbRewindBackward10} boxSize={5} />}
        aria-label='rewind'
        width={buttonWidth}
        onClick={() => playerControls.onRewind(10)}
      />
      <IconButton
        width={buttonWidth}
        onClick={() => {
          status.state != PlayerState.PLAYING ? playerControls.onPlay() : playerControls.onPause();
        }}
        icon={<Icon as={status.state != PlayerState.PLAYING ? BsFillPlayFill : BsPauseFill} boxSize={7} />}
        aria-label={status.state != PlayerState.PLAYING ? 'play' : 'pause'}
      />
      <IconButton
        width={buttonWidth}
        icon={<Icon as={TbRewindForward10} boxSize={5} />}
        aria-label='fast forward'
        onClick={() => playerControls.onForward(10)}
      />
      <IconButton width={buttonWidth} icon={<Icon as={BsSkipEndFill} boxSize={5} />} aria-label='skip forward' onClick={queueControls.onSkip} />
      <IconButton
        width={buttonWidth}
        icon={<Icon as={LuMaximize} boxSize={5} />}
        aria-label='maximize'
        onClick={() => playerControls.onFullscreenChange(true)}
      />
    </ButtonGroup>
  );
};

export default PlayerControlsBar;

import { ButtonGroup, Flex, Icon, IconButton, Spinner } from '@chakra-ui/react';
import { BsPauseFill, BsPlayFill, BsSkipEndFill, BsSkipStartFill } from 'react-icons/bs';
import PlayerState from '../../../../model/player/PlayerState';
import PlayerStatus from '../../../../model/player/PlayerStatus';
import { PlayerControls } from '../../../../hooks/player/useDesktopPlayer';
import { useEffect, useState } from 'react';
import { QueueControls } from '../../../../hooks/queue/useQueue';

interface Props {
  status: PlayerStatus;
  controls: PlayerControls;
  queueControls: QueueControls;
}

const buttonWidth = '5rem';
const getIconForState = (state: PlayerState) => {
  if (state == PlayerState.PLAYING) return BsPauseFill;
  if (state == PlayerState.PAUSED) return BsPlayFill;
  return BsPauseFill;
};
const VisualizerControls = ({ status, controls, queueControls }: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let timeout: number;
    if (status.state === PlayerState.BUFFERING) {
      timeout = setTimeout(() => setIsLoading(true), 2000);
    }
    setIsLoading(false);
    return () => clearTimeout(timeout);
  }, [status]);
  return (
    <ButtonGroup variant='ghost' borderRadius='md'>
      <IconButton icon={<Icon as={BsSkipStartFill} boxSize={5} />} aria-label='skip forward' width={buttonWidth} onClick={queueControls.onSkipBack} />
      <Flex justifyContent='center' width={buttonWidth} alignItems='center'>
        {isLoading ? (
          <Spinner size='sm' />
        ) : (
          <IconButton
            onClick={status.state != PlayerState.PLAYING ? controls.onPlay : controls.onPause}
            icon={<Icon as={getIconForState(status.state)} boxSize={7} />}
            aria-label={status.state != PlayerState.PLAYING ? 'play' : 'pause'}
          />
        )}
      </Flex>
      <IconButton width={buttonWidth} icon={<Icon as={BsSkipEndFill} boxSize={5} />} aria-label='skip forward' onClick={queueControls.onSkip} />
    </ButtonGroup>
  );
};

export default VisualizerControls;

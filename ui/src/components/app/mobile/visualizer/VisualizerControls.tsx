import { ButtonGroup, Flex, Icon, IconButton, Spinner } from '@chakra-ui/react';
import { BsPauseFill, BsPlayFill, BsSkipEndFill, BsSkipStartFill } from 'react-icons/bs';
import PlayerState from '../../../../model/player/PlayerState';
import PlayerStatus from '../../../../model/player/PlayerStatus';
import { useState } from 'react';
import { QueueControls } from '../../../../hooks/queue/useQueue';
import { LuSettings } from 'react-icons/lu';
import VisualizerControlOptionsModal from './VisualizerControlsOptionsModal';
import { MobilePlayerControls } from '../../../../hooks/player/useMobilePlayerStatus';
import VisualizerSoundMenu from './VisualizerSoundMenu';

interface Props {
  status: PlayerStatus;
  controls: MobilePlayerControls;
  queueControls: QueueControls;
}

const buttonWidth = '4rem';
const getIconForState = (state: PlayerState) => {
  if (state == PlayerState.PLAYING) return BsPauseFill;
  if (state == PlayerState.PAUSED) return BsPlayFill;
  return BsPauseFill;
};
const VisualizerControls = ({ status, controls, queueControls }: Props) => {
  const [openExtraOptions, setOpenExtraOptions] = useState(false);
  const isLoading = status.state === PlayerState.BUFFERING;

  return (
    <Flex alignItems='center' justifyContent='space-between' alignSelf='stretch' paddingX={5} gap={2}>
      <VisualizerControlOptionsModal isOpen={openExtraOptions} onClose={() => setOpenExtraOptions(false)} status={status} controls={controls} />
      <VisualizerSoundMenu volume={status.volume} onChangeVolume={controls.onVolumeChange} />
      <ButtonGroup variant='ghost' borderRadius='md'>
        <IconButton
          icon={<Icon as={BsSkipStartFill} boxSize={5} />}
          aria-label='skip forward'
          width={buttonWidth}
          onClick={queueControls.onSkipBack}
        />
        <Flex justifyContent='center' width={buttonWidth} alignItems='center'>
          {isLoading ? (
            <Spinner size='sm' />
          ) : (
            <IconButton
              onClick={status.state === PlayerState.PAUSED ? controls.onPlay : controls.onPause}
              icon={<Icon as={getIconForState(status.state)} boxSize={7} />}
              aria-label={status.state != PlayerState.PLAYING ? 'play' : 'pause'}
            />
          )}
        </Flex>
        <IconButton width={buttonWidth} icon={<Icon as={BsSkipEndFill} boxSize={5} />} aria-label='skip forward' onClick={queueControls.onSkip} />
      </ButtonGroup>
      <IconButton
        variant='ghost'
        color='text.300'
        icon={<Icon as={LuSettings} boxSize={'1rem'} />}
        aria-label='options'
        onClick={() => setOpenExtraOptions(true)}
      />
    </Flex>
  );
};

export default VisualizerControls;

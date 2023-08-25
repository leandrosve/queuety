import { Button, Flex, Icon, Text } from '@chakra-ui/react';
import GlassModal from '../../../common/glass/GlassModal';
import { PropsWithChildren } from 'react';
import { LuMaximize, LuSlidersHorizontal } from 'react-icons/lu';
import { RiSpeedUpFill } from 'react-icons/ri';
import { useTranslation } from 'react-i18next';
import SelectMenu from '../../../common/SelectMenu';
import PlayerStatus from '../../../../model/player/PlayerStatus';
import { useMemo } from 'react';
import { PlayerControls } from '../../../../hooks/player/useDesktopPlayer';
import { MobilePlayerControls } from '../../../../hooks/player/useMobilePlayerStatus';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  status: PlayerStatus;
  controls: MobilePlayerControls;
}
const playbackRateOptions: [string, string][] = ['0.25', '0.5', '0.7', '1', '1.25', '1.5', '1.75', '2'].map((o) => [o, o]);
const qualityOptions: [string, string][] = ['High', 'Medium', 'Low'].map((o) => [o, o]);

const VisualizerControlOptionsModal = ({ isOpen, onClose, controls }: Props) => {
  const { t } = useTranslation();

  return (
    <GlassModal isOpen={isOpen} onClose={onClose} isCentered maxWidth={'90vw'} bodyProps={{ padding: 2 }}>
      <Option onClick={() => controls.onFullscreenChange(true)} icon={LuMaximize}>
        <Flex alignItems='center' grow={1} justifyContent={'space-between'}>
          <div>Fullscreen</div>
          <Text color='text.300' fontSize='sm'>
            off
          </Text>
        </Flex>
      </Option>
      <Menu options={playbackRateOptions} label='Playback Rate' icon={RiSpeedUpFill} value='1' />
      <Menu options={qualityOptions} label='Video Quality' icon={LuSlidersHorizontal} value='High' />
    </GlassModal>
  );
};
interface MenuProps {
  options: [value: string, label: string][];
  label: string;
  icon: () => JSX.Element;
  value: string;
}
const Menu = ({ options, label, icon, value }: MenuProps) => {
  const selectedLabel = useMemo(() => options.find(([v]) => v == value)?.[1], [value, options]);
  return (
    <SelectMenu
      triggerWidth='100%'
      icon={<LuSlidersHorizontal />}
      variant='ghost'
      buttonProps={{ paddingX: 3, paddingY: 3 }}
      buttonContent={
        <Flex fontWeight='normal' gap={2} alignItems='center' justifyContent='space-between'>
          <Flex fontWeight='normal' gap={4} alignItems='center'>
            <Icon as={icon} boxSize={5} />
            {label}
          </Flex>
          <Text as='span' fontSize='sm' color='text.300'>
            {selectedLabel}
          </Text>
        </Flex>
      }
      value={value}
      onChange={(v) => {}}
      options={options}
    />
  );
};

interface OptionProps extends PropsWithChildren {
  onClick: () => void;
  icon?: () => JSX.Element;
}
const Option = ({ onClick, icon, children }: OptionProps) => (
  <Button
    fontWeight='normal'
    leftIcon={<Icon as={icon} boxSize={5} />}
    variant='ghost'
    width='100%'
    padding={3}
    paddingX={0}
    justifyContent='start'
    gap={2}
    onClick={onClick}
  >
    {children}
  </Button>
);

export default VisualizerControlOptionsModal;

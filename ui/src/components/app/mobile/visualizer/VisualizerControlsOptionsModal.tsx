import { Button, Flex, Icon, Spinner, Text } from '@chakra-ui/react';
import GlassModal from '../../../common/glass/GlassModal';
import { PropsWithChildren, ReactNode, useEffect, useState } from 'react';
import { LuMaximize, LuSlidersHorizontal } from 'react-icons/lu';
import { RiSpeedUpFill } from 'react-icons/ri';
import SelectMenu from '../../../common/SelectMenu';
import PlayerStatus from '../../../../model/player/PlayerStatus';
import { useMemo } from 'react';
import { MobilePlayerControls } from '../../../../hooks/player/useMobilePlayerStatus';
import { useTranslation } from 'react-i18next';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  status: PlayerStatus;
  controls: MobilePlayerControls;
}
const playbackRateOptions: [number, string][] = [0.25, 0.5, 0.7, 1, 1.25, 1.5, 1.75, 2].map((o) => [o, o.toString()]);

const VisualizerControlOptionsModal = ({ isOpen, onClose, controls, status }: Props) => {
  const [loading, setLoading] = useState({ fullscreen: false, rate: false });
  const { t } = useTranslation();

  const onToggleFullscreen = () => {
    setLoading((p) => ({ ...p, fullscreen: true }));
    controls.onFullscreenChange(!status.fullscreen);
  };
  const onChangeRate = (rate: number) => {
    setLoading((p) => ({ ...p, rate: true }));
    controls.onRateChange(rate);
  };

  useEffect(() => {
    setLoading((p) => ({ ...p, fullscreen: false }));
  }, [status.fullscreen]);
  useEffect(() => {
    setLoading((p) => ({ ...p, rate: false }));
  }, [status.rate]);

  return (
    <GlassModal isOpen={isOpen} onClose={onClose} isCentered maxWidth={'90vw'} bodyProps={{ padding: 2 }}>
      <Option onClick={onToggleFullscreen} icon={LuMaximize}>
        <Flex alignItems='center' grow={1} justifyContent={'space-between'}>
          <div>{t('player.fullscreen')}</div>
          {loading.fullscreen ? (
            <Spinner size='sm' color='text.300' />
          ) : (
            <Text color='text.300' fontSize='sm'>
              {t(`common.${status.fullscreen ? 'on' : 'off'}`)}
            </Text>
          )}
        </Flex>
      </Option>
      <Menu
        options={playbackRateOptions}
        onChange={onChangeRate}
        label={t('player.playbackRate')}
        icon={RiSpeedUpFill}
        value={status.rate}
        isLoading={loading.rate}
      />
    </GlassModal>
  );
};
interface MenuProps<T> {
  options: [value: T, label: string][];
  label: string;
  icon: () => JSX.Element;
  value: T;
  renderItem?: (value: T) => ReactNode;
  isDisabled?: boolean;
  onChange?: (value: T) => void;
  isLoading?: boolean;
}
const Menu = <T,>({ options, label, icon, value, renderItem, isDisabled, onChange, isLoading }: MenuProps<T>) => {
  const selectedLabel = useMemo(() => options.find(([v]) => v == value)?.[1], [value, options]);
  return (
    <SelectMenu
      triggerWidth='100%'
      icon={<LuSlidersHorizontal />}
      variant='ghost'
      onChange={onChange}
      renderItem={renderItem}
      buttonProps={{ paddingX: 3, paddingY: 3, isDisabled }}
      buttonContent={
        <Flex fontWeight='normal' gap={2} alignItems='center' justifyContent='space-between'>
          <Flex fontWeight='normal' gap={4} alignItems='center'>
            <Icon as={icon} boxSize={5} />
            {label}
          </Flex>
          <Text as='span' fontSize='sm' color='text.300'>
            {isLoading ? <Spinner size='sm' /> : selectedLabel}
          </Text>
        </Flex>
      }
      value={value}
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

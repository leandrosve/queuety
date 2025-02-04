import { Box, Button, ButtonGroup, Flex, Icon, Spinner, Stack, Text } from '@chakra-ui/react';
import GlassModal from '../../../common/glass/GlassModal';
import { PropsWithChildren, useEffect, useState } from 'react';
import { LuMaximize } from 'react-icons/lu';
import { RiSpeedUpFill } from 'react-icons/ri';
import PlayerStatus from '../../../../model/player/PlayerStatus';
import { MobilePlayerControls } from '../../../../hooks/player/useMobilePlayerStatus';
import { useTranslation } from 'react-i18next';
import { useMobileAuthContext } from '../../../../context/MobileAuthContext';
import { HostStatus } from '../../../../hooks/connection/useMobileAuth';
import { IconType } from 'react-icons/lib';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  status: PlayerStatus;
  controls: MobilePlayerControls;
}
const playbackRateOptions: [number, string][] = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((o) => [o, o.toString()]);

const VisualizerControlOptionsModal = ({ isOpen, onClose, controls, status }: Props) => {
  const [loading, setLoading] = useState({ fullscreen: false, rate: false });
  const { hostStatus } = useMobileAuthContext();
  const { t } = useTranslation();

  const onToggleFullscreen = () => {
    if (hostStatus == HostStatus.DISCONNECTED) return;
    setLoading((p) => ({ ...p, fullscreen: true }));
    controls.onFullscreenChange(!status.fullscreen);
  };
  const onChangeRate = (rate: number) => {
    if (hostStatus == HostStatus.DISCONNECTED) return;
    if (status.rate == rate) return;
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

      <Stack padding={3} spacing={2} align='start'>
        <Flex alignItems='center' gap={4}>
          <Icon as={RiSpeedUpFill} boxSize={5} />
          <Text>{t('player.playbackRate')}</Text>
        </Flex>

        <Box position='relative'>
          <ButtonGroup isAttached borderRadius='md' size='sm' flexWrap='wrap' justifyContent='center'>
            {playbackRateOptions.map((rate) => (
              <Button
                key={rate[0]}
                minWidth='4rem'
                variant={status.rate == rate[0] ? 'solid' : 'solid'}
                colorScheme={status.rate == rate[0] ? 'primary' : 'gray'}
                onClick={() => onChangeRate(rate[0])}
                isDisabled={loading.rate}
              >
                {rate[0] == 1 ? 'Normal' : `${rate[1]}x`}
              </Button>
            ))}
          </ButtonGroup>
          {loading.rate && <Spinner position='absolute' top={0} left={0} right={0} bottom={0} margin='auto' />}
        </Box>
      </Stack>
    </GlassModal>
  );
};

interface OptionProps extends PropsWithChildren {
  onClick: () => void;
  icon?: (() => JSX.Element ) | IconType;
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

import { Button, Flex, Stack, Text, useColorMode } from '@chakra-ui/react';
import StorageUtils, { StorageKey } from '../../../../utils/StorageUtils';
import Layout from '../../../common/layout/Layout';
import { PiTelevisionFill } from 'react-icons/pi';
import { TbDeviceRemote } from 'react-icons/tb';
import useLayoutBackdrop from '../../../../hooks/layout/useLayoutBackdrop';
import VisualizerBackdrop from '../../mobile/visualizer/VisualizerBackdrop';
import NavbarMobile from '../../mobile/layout/NavbarMobile';
import SettingsModal from '../settings/SettingsModal';
import { useState } from 'react';
import { LayoutBackdropPicture } from '../../../../context/LayoutContext';

export enum DeviceType {
  MOBILE = 'MOBILE',
  DESKTOP = 'DESKTOP',
}

interface Props {
  onSelected: (type: DeviceType) => void;
}

const DeviceSelection = ({ onSelected }: Props) => {
  const { colorMode } = useColorMode();
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  useLayoutBackdrop(true, LayoutBackdropPicture.DEVICE_SELECTION);
  const handleSelect = (type: DeviceType) => {
    StorageUtils.set(StorageKey.DEVICE, type);
    onSelected(type);
  };

  return (
    <>
      <NavbarMobile onOpenSettingsModal={() => setIsSettingsModalOpen(true)} />
      <SettingsModal isMobile={true} isOpen={isSettingsModalOpen} onClose={() => setIsSettingsModalOpen(false)} />
      <Flex grow={1} alignItems='start' justifyContent='center' flex='1 1 0' minHeight={0} position='relative'>
        <Flex direction='column' gap={3} padding={2}>
          <Text>Selecciona como quieres utilizar este dispositivo</Text>
          <Button leftIcon={<PiTelevisionFill />} size='lg' padding='4rem' onClick={() => handleSelect(DeviceType.DESKTOP)}>
            Desktop
          </Button>
          <Button leftIcon={<TbDeviceRemote />} size='lg' padding='4rem' onClick={() => handleSelect(DeviceType.MOBILE)}>
            Mobile
          </Button>
        </Flex>
      </Flex>
    </>
  );
};

export default DeviceSelection;

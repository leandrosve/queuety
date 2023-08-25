import { Button, Flex, Stack, Text } from '@chakra-ui/react';
import StorageUtils, { StorageKey } from '../../../../utils/StorageUtils';
import Layout from '../../../common/layout/Layout';
import { PiTelevisionFill } from 'react-icons/pi';
import { TbDeviceRemote } from 'react-icons/tb';

export enum DeviceType {
  MOBILE = 'MOBILE',
  DESKTOP = 'DESKTOP',
}

interface Props {
  onSelected: (type: DeviceType) => void;
}

const DeviceSelection = ({ onSelected }: Props) => {
  const handleSelect = (type: DeviceType) => {
    StorageUtils.set(StorageKey.DEVICE, type);
    onSelected(type);
  };

  return (
    <Layout>
      <Flex direction='column' gap={3} padding={2}>
        <Text>Selecciona como quieres utilizar este dispositivo</Text>
        <Button leftIcon={<PiTelevisionFill />} size='lg' padding='4rem' onClick={() => handleSelect(DeviceType.DESKTOP)}>
          Desktop
        </Button>
        <Button leftIcon={<TbDeviceRemote />} size='lg' padding='4rem' onClick={() => handleSelect(DeviceType.MOBILE)}>
          Mobile
        </Button>
      </Flex>
    </Layout>
  );
};

export default DeviceSelection;

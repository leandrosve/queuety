import { Button, Flex, Icon, Text } from '@chakra-ui/react';
import { useMemo } from 'react';
import { PiScreencastFill } from 'react-icons/pi';
import HostData from '../../../model/auth/HostData';
import FormatUtils from '../../../utils/FormatUtils';
import useLayoutBackdrop from '../../../hooks/layout/useLayoutBackdrop';
import { LayoutBackdropPicture } from '../../../context/LayoutContext';
import BrandIcon from '../../../assets/images/BrandIcon';
import { LuPlus } from 'react-icons/lu';

interface Props {
  host: HostData;
  onOpenSearchModal: () => void;
}
const MobileAppWelcome = ({ host, onOpenSearchModal }: Props) => {
  const hostColor = useMemo(() => FormatUtils.getColorForNickname(host.nickname), [host]);
  useLayoutBackdrop(true, LayoutBackdropPicture.DESKTOP_WELCOME);
  return (
    <Flex direction='column' justifyContent='center' alignItems='center' gap={2} grow={1} padding={3}>
      <Flex direction='column' justifyContent='center' alignItems='center' gap={2} grow={1}>
        <Icon as={BrandIcon} boxSize={'45px'} />
        <Text fontSize='lg' textAlign='center' size='md'>
          <b>Aún no se han agregado videos</b> <br />
          ¡Puedes comenzar agregando uno!
        </Text>
        <Button
          leftIcon={<LuPlus />}
          alignSelf='center'
          width='auto'
          justifyContent='start'
          onClick={onOpenSearchModal}
          overflow='hidden'
          textOverflow='ellipsis'
        >
          <Text noOfLines={1}>Agregar videos</Text>
        </Button>
      </Flex>
      <Flex justifyContent='center' alignItems='center' wrap='wrap' gap={2} rowGap={1} marginTop='auto' textAlign='center' paddingBottom={10}>
        <Text fontWeight='light'>Conectado a </Text>
        <Flex alignItems='center' position='relative' color='white' borderRadius='lg' backgroundColor={`${hostColor}.500`} paddingX={2} gap={1}>
          <PiScreencastFill />
          <Text as='span'>{host.nickname}</Text>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default MobileAppWelcome;

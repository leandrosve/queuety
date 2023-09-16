import { Box, Flex, Heading, Icon, Spinner, Text } from '@chakra-ui/react';
import { LayoutBackdropPicture } from '../../../../context/LayoutContext';
import useLayoutBackdrop from '../../../../hooks/layout/useLayoutBackdrop';
import BrandIcon from '../../../../assets/images/BrandIcon';
import { useEffect, useState } from 'react';
import StatusService from '../../../../services/api/ConnectionService copy';
import { useNavigate } from 'react-router-dom';

const MaintenanceView = () => {
  useLayoutBackdrop(true, LayoutBackdropPicture.DEVICE_SELECTION);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const checkStatus = async () => {
    const res = await StatusService.getStatus();
    if (!res.hasError) {
      navigate('/app');
    }
    setLoading(false);
  };

  useEffect(() => {
    checkStatus();
    const id = setInterval(checkStatus, 15000);
    return () => clearInterval(id);
  }, []);

  if (loading)
    return (
      <Flex alignItems='center' justifyContent='center' height='100vh' width='100vw'>
        <Spinner size='lg' />
      </Flex>
    );
  return (
    <Flex alignItems='center' justifyContent='center' grow={1} direction='column' padding={5}>
      <Box>
        <Icon as={BrandIcon} boxSize={8} />
        <Heading size='md'>Lo sentimos, parece que nuestros servidores no estan funcionando correctamente...</Heading>
        <Text>Puedes volver a intentarlo en unos minutos</Text>
      </Box>
    </Flex>
  );
};

export default MaintenanceView;

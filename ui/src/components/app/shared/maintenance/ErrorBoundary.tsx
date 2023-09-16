import { Component, ErrorInfo, ReactNode, useState } from 'react';
import { Box, Button, Flex, Heading, Icon, Image, Text, Wrap, WrapItem } from '@chakra-ui/react';
import BrandIcon from '../../../../assets/images/BrandIcon';
import useLayoutBackdrop from '../../../../hooks/layout/useLayoutBackdrop';
import { LayoutBackdropPicture } from '../../../../context/LayoutContext';
import { LuRefreshCcw } from 'react-icons/lu';
import { PiBroom, PiBroomFill } from 'react-icons/pi';
interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return <ErrorView />;
    }

    return this.props.children;
  }
}

export const ErrorView = () => {
  useLayoutBackdrop(true, LayoutBackdropPicture.DEVICE_SELECTION);
  const [loading, setLoading] = useState(false);
  const onDeleteData = () => {
    setLoading(true);
    localStorage.clear();
    sessionStorage.clear();
    document.cookie = '';
    setTimeout(() => location.replace('/'), 2000);
  };
  return (
    <Flex alignItems='center' justifyContent='center' grow={1} direction='column' padding={5}>
      <Box>
        <Icon as={BrandIcon} boxSize={8} />
        <Heading size='md'>¡Ups! No deberias estar viendo esto...</Heading>
        <Text>Si te sigues encontrando con este problema, puedes intentar borrar los datos de navegación para este sitio.</Text>
        <Flex gap={5} mt={5} alignItems='center' justifyContent='center' wrap='wrap'>
          <Button onClick={() => location.reload()} leftIcon={<LuRefreshCcw />}>
            Recargar la página
          </Button>
          <Button colorScheme='primary' isLoading={loading} onClick={onDeleteData}>
            Borrar datos de navegación
          </Button>
        </Flex>
      </Box>
    </Flex>
  );
};

export default ErrorBoundary;

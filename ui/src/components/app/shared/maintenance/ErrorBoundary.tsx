import { Component, ErrorInfo, ReactNode, useState } from 'react';
import { Box, Button, Flex, Heading, Icon, Image, Text, Wrap, WrapItem } from '@chakra-ui/react';
import BrandIcon from '../../../../assets/images/BrandIcon';
import useLayoutBackdrop from '../../../../hooks/layout/useLayoutBackdrop';
import { LayoutBackdropPicture } from '../../../../context/LayoutContext';
import { LuRefreshCcw } from 'react-icons/lu';
import { PiBroom, PiBroomFill } from 'react-icons/pi';
import { useTranslation } from 'react-i18next';
import ContactModal from '../contact/ContactModal';
import { BiMessageRoundedError } from 'react-icons/bi';
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
  const { t } = useTranslation();
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const onDeleteData = () => {
    setLoading(true);
    localStorage.clear();
    sessionStorage.clear();
    document.cookie = '';
    setTimeout(() => location.replace('/'), 2000);
  };
  return (
    <Flex alignItems='center' justifyContent='center' grow={1} direction='column' padding={5} className='section-fade-in'>
      <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
      <Box>
        <Icon as={BrandIcon} boxSize={8} />
        <Heading size='md'>{t('errorView.title')}</Heading>
        <Text>{t('errorView.description')}</Text>
        <Flex gap={5} mt={5} alignItems='center' justifyContent='center' wrap='wrap'>
          <Button onClick={() => location.reload()} leftIcon={<LuRefreshCcw />}>
            {t('errorView.refresh')}
          </Button>
          <Button colorScheme='primary' isLoading={loading} onClick={onDeleteData}>
            {t('errorView.erase')}
          </Button>

          <Button onClick={() => setIsContactModalOpen(true)} leftIcon={<BiMessageRoundedError />}>
            {t('errorView.notify')}
          </Button>
        </Flex>
      </Box>
    </Flex>
  );
};

export default ErrorBoundary;

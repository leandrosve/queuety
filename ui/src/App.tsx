import './assets/css/app.css';
import { Box, ChakraProvider, Flex, Spinner } from '@chakra-ui/react';
import theme from './lib/chakra/chakraTheme';
import './i18n/i18n';
import { SettingsProvider } from './context/SettingsContext';
import { Suspense } from 'react';
import DuplicateTabChecker from './components/app/shared/device/DuplicateTabChecker';
import LayoutProvider from './context/LayoutContext';
import LayoutBackdrop from './components/common/layout/LayoutBackdrop';
import MainRouter from './router/MainRouter';
import ErrorBoundary from './components/app/shared/maintenance/ErrorBoundary';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <LayoutProvider>
        <ErrorBoundary>
          <SettingsProvider>
            <Box className='app' position='relative' zIndex={1}>
              <DuplicateTabChecker>
                <Suspense fallback={<Loader />}>
                  <MainRouter />
                </Suspense>
              </DuplicateTabChecker>
              <LayoutBackdrop />
            </Box>
          </SettingsProvider>
        </ErrorBoundary>
      </LayoutProvider>
    </ChakraProvider>
  );
}

const Loader = () => (
  <Flex alignItems='center' justifyContent='center' height='100vh' width='100vw'>
    <Spinner size='lg' />
  </Flex>
);

export default App;

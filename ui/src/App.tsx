import './assets/css/app.css';
import { ChakraProvider, Flex, Spinner, useMediaQuery } from '@chakra-ui/react';
import theme from './lib/chakra/chakraTheme';
import './i18n/i18n';
import DesktopApp from './components/app/desktop/DesktopApp';
import { SettingsProvider } from './context/SettingsContext';
import MobileApp from './components/app/mobile/MobileApp';
import { useEffect, useState } from 'react';
import { Suspense, lazy } from 'react';

const DesktopAppLazy = lazy(() => import('./components/app/desktop/DesktopApp'));
const MobileAppLazy = lazy(() => import('./components/app/mobile/MobileApp'));

function App() {
  // This damn hooks always run twice for some reason
  const [initialized, setInitialized] = useState(false);
  const [isMobile] = useMediaQuery('(max-width: 800px)', { fallback: false });
  useEffect(() => {
    setInitialized(true);
  }, [isMobile]);
  if (!initialized) return null;
  return (
    <ChakraProvider theme={theme}>
      <SettingsProvider>
        <div className='app'>
          <Suspense fallback={<Loader />}>{isMobile ? <MobileAppLazy /> : <DesktopAppLazy />}</Suspense>
        </div>
      </SettingsProvider>
    </ChakraProvider>
  );
}

const Loader = () => (
  <Flex alignItems='center' justifyContent='center' height='100vh' width='100vw'>
    <Spinner size='lg' />
  </Flex>
);

export default App;

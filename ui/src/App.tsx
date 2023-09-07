import './assets/css/app.css';
import { Box, ChakraProvider, Flex, Spinner, useColorMode } from '@chakra-ui/react';
import theme from './lib/chakra/chakraTheme';
import './i18n/i18n';
import { SettingsProvider } from './context/SettingsContext';
import { useCallback, useState, useEffect } from 'react';
import { Suspense, lazy } from 'react';
import DeviceSelection, { DeviceType } from './components/app/shared/device/DeviceSelection';
import StorageUtils, { StorageKey } from './utils/StorageUtils';
import DuplicateTabChecker from './components/app/shared/device/DuplicateTabChecker';
import LayoutProvider, { useLayoutContext } from './context/LayoutContext';
import VisualizerBackdrop from './components/app/mobile/visualizer/VisualizerBackdrop';
import { color } from 'framer-motion';
import LayoutBackdrop from './components/common/layout/LayoutBackdrop';

const DesktopAppLazy = lazy(() => import('./components/app/desktop/DesktopApp'));
const MobileAppLazy = lazy(() => import('./components/app/mobile/MobileApp'));

const renderContent = (deviceType: DeviceType, onBack: () => void) => {
  if (deviceType === DeviceType.DESKTOP) return <DesktopAppLazy />;
  return <MobileAppLazy onBack={onBack} />;
};

function App() {
  // This damn hooks always run twice for some reason
  const [deviceType, setDeviceType] = useState<DeviceType | null>(StorageUtils.get(StorageKey.DEVICE) as DeviceType);

  const handleBack = useCallback(() => {
    StorageUtils.clear([StorageKey.DEVICE]);
    setDeviceType(null);
  }, []);
  return (
    <ChakraProvider theme={theme}>
      <LayoutProvider>
        <SettingsProvider>
          <Box className='app' position='relative' zIndex={1}>
            <DuplicateTabChecker>
              <Suspense fallback={<Loader />}>
                {!deviceType ? <DeviceSelection onSelected={(type) => setDeviceType(type)} /> : renderContent(deviceType, handleBack)}
              </Suspense>
            </DuplicateTabChecker>
            <LayoutBackdrop />
          </Box>
        </SettingsProvider>
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

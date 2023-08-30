import './assets/css/app.css';
import { ChakraProvider, Flex, Spinner } from '@chakra-ui/react';
import theme from './lib/chakra/chakraTheme';
import './i18n/i18n';
import { SettingsProvider } from './context/SettingsContext';
import { useState } from 'react';
import { Suspense, lazy } from 'react';
import DeviceSelection, { DeviceType } from './components/app/shared/device/DeviceSelection';
import StorageUtils, { StorageKey } from './utils/StorageUtils';
import DuplicateTabChecker from './components/app/shared/device/DuplicateTabChecker';

const DesktopAppLazy = lazy(() => import('./components/app/desktop/DesktopApp'));
const MobileAppLazy = lazy(() => import('./components/app/mobile/MobileApp'));

const renderContent = (deviceType: DeviceType) => {
  if (deviceType === DeviceType.DESKTOP) return <DesktopAppLazy />;
  return <MobileAppLazy />;
};

function App() {
  // This damn hooks always run twice for some reason
  const [deviceType, setDeviceType] = useState<DeviceType>(StorageUtils.get(StorageKey.DEVICE) as DeviceType);

  return (
    <ChakraProvider theme={theme}>
      <SettingsProvider>
        <div className='app'>
          <DuplicateTabChecker>
            <Suspense fallback={<Loader />}>
              {!deviceType ? <DeviceSelection onSelected={(type) => setDeviceType(type)} /> : renderContent(deviceType)}
            </Suspense>
          </DuplicateTabChecker>
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

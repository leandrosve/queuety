import './assets/css/app.css';
import { Box, ChakraProvider, Flex, Spinner } from '@chakra-ui/react';
import theme from './lib/chakra/chakraTheme';
import './i18n/i18n';
import { SettingsProvider } from './context/SettingsContext';
import { useCallback, useState, useEffect } from 'react';
import { Suspense, lazy } from 'react';
import DeviceSelection, { DeviceType } from './components/app/shared/device/DeviceSelection';
import StorageUtils, { StorageKey } from './utils/StorageUtils';
import DuplicateTabChecker from './components/app/shared/device/DuplicateTabChecker';
import LayoutProvider from './context/LayoutContext';
import LayoutBackdrop from './components/common/layout/LayoutBackdrop';
import AuthUtils from './utils/AuthUtils';
import RoomSwitchWarning from './components/app/shared/auth/RoomSwitchWarning';

const DesktopAppLazy = lazy(() => import('./components/app/desktop/DesktopApp'));
const MobileAppLazy = lazy(() => import('./components/app/mobile/MobileApp'));

function App() {
  return (
    <ChakraProvider theme={theme}>
      <LayoutProvider>
        <SettingsProvider>
          <Box className='app' position='relative' zIndex={1}>
            <DuplicateTabChecker>
              <Suspense fallback={<Loader />}>
                <AppContent />
              </Suspense>
            </DuplicateTabChecker>
            <LayoutBackdrop />
          </Box>
        </SettingsProvider>
      </LayoutProvider>
    </ChakraProvider>
  );
}

const shouldDisplayWarning = () => {
  const authParam = AuthUtils.getAuthParam();
  const mobileAuthRoomId = StorageUtils.get(StorageKey.MOBILE_AUTH_ROOM_ID);
  const playerRoomId = StorageUtils.get(StorageKey.PLAYER_ROOM_ID);
  console.log(mobileAuthRoomId, authParam)
  return !!(authParam && playerRoomId && mobileAuthRoomId && (mobileAuthRoomId !== authParam));
};

const AppContent = () => {
  const [deviceType, setDeviceType] = useState<DeviceType | null>(StorageUtils.get(StorageKey.DEVICE) as DeviceType);
  const [showWarning] = useState<boolean>(shouldDisplayWarning());

  const handleBack = useCallback(() => {
    StorageUtils.clear([StorageKey.DEVICE]);
    setDeviceType(null);
  }, []);

  useEffect(() => {
    const authParam = AuthUtils.getAuthParam();
    const hostAuthRoomId = StorageUtils.get(StorageKey.AUTH_ROOM_ID);
    const playerRoomId = StorageUtils.get(StorageKey.PLAYER_ROOM_ID);
    if (authParam && !playerRoomId && deviceType !== DeviceType.DESKTOP) {
      setDeviceType(DeviceType.MOBILE);
      StorageUtils.setRaw(StorageKey.DEVICE, DeviceType.MOBILE);
    }
    if (authParam && deviceType == DeviceType.DESKTOP && authParam === hostAuthRoomId) {
      history.replaceState({}, document.title, '/');
      return;
    }
  }, []);

  if (showWarning) return <RoomSwitchWarning />;
  if (!deviceType) return <DeviceSelection onSelected={(type) => setDeviceType(type)} />;
  if (deviceType === DeviceType.DESKTOP) return <DesktopAppLazy />;
  return <MobileAppLazy onBack={handleBack} />;
};

const Loader = () => (
  <Flex alignItems='center' justifyContent='center' height='100vh' width='100vw'>
    <Spinner size='lg' />
  </Flex>
);

export default App;

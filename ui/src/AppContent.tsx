import './assets/css/app.css';
import { Flex, Spinner } from '@chakra-ui/react';
import './i18n/i18n';
import { useCallback, useState, useEffect } from 'react';
import { lazy } from 'react';
import DeviceSelection, { DeviceType } from './components/app/shared/device/DeviceSelection';
import StorageUtils, { StorageKey } from './utils/StorageUtils';
import AuthUtils from './utils/AuthUtils';
import RoomSwitchWarning from './components/app/shared/auth/RoomSwitchWarning';
import StatusService from './services/api/StatusService';
import { Navigate } from 'react-router-dom';

const DesktopAppLazy = lazy(() => import('./components/app/desktop/DesktopApp'));
const MobileAppLazy = lazy(() => import('./components/app/mobile/MobileApp'));

enum ServerStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  WAITING = 'waiting',
}

const shouldDisplayWarning = () => {
  const authParam = AuthUtils.getAuthParam();
  const deviceType = StorageUtils.get(StorageKey.DEVICE);
  const hostAuthRoomId = StorageUtils.get(StorageKey.AUTH_ROOM_ID);
  const mobileAuthRoomId = StorageUtils.get(StorageKey.MOBILE_AUTH_ROOM_ID);
  const playerRoomId = StorageUtils.get(StorageKey.PLAYER_ROOM_ID);
  if (!authParam || !playerRoomId) return false;
  if (mobileAuthRoomId && mobileAuthRoomId !== authParam) return true;
  if (deviceType == DeviceType.DESKTOP && authParam !== hostAuthRoomId) return true;
  return false;
};

export const AppContent = () => {
  const [deviceType, setDeviceType] = useState<DeviceType | null>(StorageUtils.get(StorageKey.DEVICE) as DeviceType);
  const [showWarning] = useState<boolean>(shouldDisplayWarning());
  const [serverStatus, setServerStatus] = useState<ServerStatus>(ServerStatus.WAITING);
  const handleBack = useCallback(() => {
    if (deviceType == DeviceType.DESKTOP) {
      StorageUtils.clearAll({ exceptions: [StorageKey.SETTINGS, StorageKey.USER_ID, StorageKey.CONNECTION_SETTINGS] });
    } else {
      StorageUtils.clear([StorageKey.DEVICE]);
    }
    setDeviceType(null);
  }, [deviceType]);

  useEffect(() => {
    const authParam = AuthUtils.getAuthParam();
    const hostAuthRoomId = StorageUtils.get(StorageKey.AUTH_ROOM_ID);
    const playerRoomId = StorageUtils.get(StorageKey.PLAYER_ROOM_ID);
    if (authParam && !playerRoomId && deviceType !== DeviceType.DESKTOP) {
      setDeviceType(DeviceType.MOBILE);
      StorageUtils.setRaw(StorageKey.DEVICE, DeviceType.MOBILE);
    }
    if (authParam && deviceType == DeviceType.DESKTOP) {
      if (authParam === hostAuthRoomId) {
        history.replaceState({}, document.title, '/app');
        return;
      }
    }
  }, []);

  useEffect(() => {
    StatusService.getStatus().then((res) => {
      setServerStatus(!res.hasError ? ServerStatus.ONLINE : ServerStatus.OFFLINE);
    });
  }, []);

  if (serverStatus === ServerStatus.WAITING)
    return (
      <Flex alignItems='center' justifyContent='center' height='100vh' width='100vw'>
        <Spinner size='lg' />
      </Flex>
    );
  if (serverStatus === ServerStatus.OFFLINE) {
    return <Navigate to='/maintenance' />;
  }

  if (showWarning) return <RoomSwitchWarning />;
  if (!deviceType) return <DeviceSelection onSelected={(type) => setDeviceType(type)} />;
  if (deviceType === DeviceType.DESKTOP) return <DesktopAppLazy onGoBack={handleBack} />;
  return <MobileAppLazy onBack={handleBack} />;
};

export default AppContent;

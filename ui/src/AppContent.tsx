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
  const mobileAuthRoomId = StorageUtils.get(StorageKey.MOBILE_AUTH_ROOM_ID);
  const playerRoomId = StorageUtils.get(StorageKey.PLAYER_ROOM_ID);
  return !!(authParam && playerRoomId && mobileAuthRoomId && mobileAuthRoomId !== authParam);
};

export const AppContent = () => {
  const [deviceType, setDeviceType] = useState<DeviceType | null>(StorageUtils.get(StorageKey.DEVICE) as DeviceType);
  const [showWarning] = useState<boolean>(shouldDisplayWarning());
  const [serverStatus, setServerStatus] = useState<ServerStatus>(ServerStatus.WAITING);
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
      history.replaceState({}, document.title);
      return;
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
  if (deviceType === DeviceType.DESKTOP) return <DesktopAppLazy />;
  return <MobileAppLazy onBack={handleBack} />;
};

export default AppContent;

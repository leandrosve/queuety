import Layout from '../../common/layout/Layout';
import { MobileAuthProvider, useMobileAuthContext } from '../../../context/MobileAuthContext';
import MobileConnectionView from './connection/MobileConnectionView';
import { MobileAuthStatus } from '../../../hooks/connection/useMobileAuth';
import MobileAppView from './MobileAppView';

const MobileApp = () => {
  return (
    <Layout isMobile>
      <MobileAuthProvider>
        <Content />
      </MobileAuthProvider>
    </Layout>
  );
};

const Content = () => {
  const { playerRoomId, userId, status, host } = useMobileAuthContext();

  if (!userId) return null;
  console.log({playerRoomId, host, status});
  if (!playerRoomId || !host || status != MobileAuthStatus.JOINED_PLAYER_ROOM) return <MobileConnectionView />;
  return <MobileAppView {...{ playerRoomId, userId, host }} />;
};

export default MobileApp;

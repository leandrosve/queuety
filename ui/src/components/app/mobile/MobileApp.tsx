import Layout from '../../common/layout/Layout';
import { MobileAuthProvider, useMobileAuthContext } from '../../../context/MobileAuthContext';
import MobileConnectionDebugModal from './connection/MobileConnectionDebugModal';
import MobileConnectionView from './connection/MobileConnectionView';
import MobileAppPlayerView from './MobileAppPlayerView';
import { MobileAuthStatus } from '../../../hooks/connection/useMobileAuth';

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
  return (
    <>
      <MobileConnectionDebugModal />
      {!playerRoomId || status != MobileAuthStatus.JOINED_PLAYER_ROOM ? (
        <MobileConnectionView />
      ) : (
        <MobileAppPlayerView {...{ playerRoomId, userId, host }} />
      )}
    </>
  );
};

export default MobileApp;

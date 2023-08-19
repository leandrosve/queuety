import Layout from '../../common/layout/Layout';
import { MobileAuthProvider, useMobileAuthContext } from '../../../context/MobileAuthContext';
import MobileConnectionDebugModal from './connection/MobileConnectionDebugModal';
import MobileConnectionView from './connection/MobileConnectionView';
import Visualizer from './visualizer/Visualizer';
import useMobileAuth, { MobileAuthStatus } from '../../../hooks/connection/useMobileAuth';
import MobileAppPlayerView from './MobileAppPlayerView';

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
  const asd = useMobileAuthContext();
  return (
    <>
      <MobileConnectionDebugModal />
      {asd.status !== MobileAuthStatus.JOINED_PLAYER_ROOM ? <MobileConnectionView /> : <MobileAppPlayerView />}
    </>
  );
};

export default MobileApp;

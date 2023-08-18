import Layout from '../../common/layout/Layout';
import { MobileAuthProvider } from '../../../context/MobileAuthContext';
import MobileConnectionDebugModal from './connection/MobileConnectionDebugModal';
import MobileConnectionView from './connection/MobileConnectionView';
import Visualizer from './visualizer/Visualizer';

const MobileApp = () => {
  return (
    <Layout isMobile>
      <MobileAuthProvider>
        <MobileConnectionDebugModal />
        <Visualizer />
      </MobileAuthProvider>
    </Layout>
  );
};

export default MobileApp;

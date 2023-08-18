import Layout from '../../common/layout/Layout';
import { MobileAuthProvider } from '../../../context/MobileAuthContext';
import MobileConnectionDebugModal from './connection/MobileConnectionDebugModal';
import MobileConnectionView from './connection/MobileConnectionView';

const MobileApp = () => {
  return (
    <Layout isMobile>
      <MobileAuthProvider>
        <MobileConnectionDebugModal />
        <MobileConnectionView/>
      </MobileAuthProvider>
    </Layout>
  );
};

export default MobileApp;

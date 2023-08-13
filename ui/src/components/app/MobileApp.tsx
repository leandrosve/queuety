import React from 'react';
import Layout from '../layout/Layout';
import { MobileAuthProvider } from '../../context/MobileAuthContext';
import MobileConnectionDebugModal from '../connection/mobile/MobileConnectionDebugModal';
import MobileConnectionView from '../connection/mobile/MobileConnectionView';

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

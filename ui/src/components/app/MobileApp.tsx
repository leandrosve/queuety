import React from 'react';
import Layout from '../layout/Layout';
import MobileConnectionView from '../connection/mobile/MobileConnectionView';

const MobileApp = () => {
  return (
    <Layout isMobile>
      <MobileConnectionView />
    </Layout>
  );
};

export default MobileApp;

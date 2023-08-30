import Layout from '../../common/layout/Layout';
import { MobileAuthProvider, useMobileAuthContext } from '../../../context/MobileAuthContext';
import MobileConnectionDebugModal from './connection/MobileConnectionDebugModal';
import MobileConnectionView from './connection/MobileConnectionView';
import MobileAppPlayerView from './MobileAppPlayerView';
import { MobileAuthStatus } from '../../../hooks/connection/useMobileAuth';
import { useMediaQuery } from '@chakra-ui/react';
import MobileAppOrientation from './layout/MobileAppOrientation';
import { useState, useEffect } from 'react';
import MobileAppLandscapeView from './MobileAppLandscapeView';

const MobileApp = () => {
  return (
    <Layout isMobile>
      <MobileAuthProvider>
        <Content />
      </MobileAuthProvider>
    </Layout>
  );
};

const isPortrait = () => window.matchMedia('(orientation: landscape)').matches;

const Content = () => {
  const { playerRoomId, userId, status, host } = useMobileAuthContext();
  const [portrait, setPortrait] = useState(isPortrait());
  useEffect(() => {
    addEventListener('resize', () => {
      setPortrait(isPortrait);
    });
  }, []);

  if (!userId) return null;
  if (!playerRoomId || status != MobileAuthStatus.JOINED_PLAYER_ROOM) return <MobileConnectionView />;
  if (portrait) return <MobileAppLandscapeView {...{ playerRoomId, userId, host }} />;
  return <MobileAppPlayerView {...{ playerRoomId, userId, host }} />;
};

export default MobileApp;

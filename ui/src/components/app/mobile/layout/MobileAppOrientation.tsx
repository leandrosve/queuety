import React, { useEffect, useState } from 'react';
import HostData from '../../../../model/auth/HostData';
import MobileAppPlayerView from '../MobileAppPlayerView';

interface Props {
  playerRoomId: string;
  userId: string;
  host: HostData;
}

const isPortrait = () => window.matchMedia('(orientation: portrait)').matches;

const MobileAppOrientation = (props: Props) => {
  const [portrait, setPortrait] = useState(isPortrait());
  useEffect(() => {
    addEventListener('resize', () => {
      setPortrait(isPortrait);
    });
  }, []);
  if (portrait) return <MobileAppPlayerView {...props} />;

  return <MobileAppPlayerView {...props} />;
};

export default MobileAppOrientation;

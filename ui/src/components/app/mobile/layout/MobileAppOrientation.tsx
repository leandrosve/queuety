import React, { useEffect, useState } from 'react';
import HostData from '../../../../model/auth/HostData';
import MobileAppPortraitView from '../MobileAppPortraitView';

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
  if (portrait) return <MobileAppPortraitView {...props} />;

  return <MobileAppPortraitView {...props} />;
};

export default MobileAppOrientation;

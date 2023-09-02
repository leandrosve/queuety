import React, { useEffect, useState } from 'react';
import HostData from '../../../model/auth/HostData';
import MobileAppLandscapeView from './MobileAppLandscapeView';
import MobileAppPortraitView from './MobileAppPortraitView';
import useMobileQueue from '../../../hooks/queue/useMobileQueue';
import useMobilePlayerStatus from '../../../hooks/player/useMobilePlayerStatus';

interface Props {
  playerRoomId: string;
  userId: string;
  host: HostData;
}
const isPortrait = () => window.matchMedia('(orientation: landscape)').matches;

const MobileAppView = (props: Props) => {
  const [portrait, setPortrait] = useState(isPortrait());

  const { queue, controls: queueControls } = useMobileQueue(props.playerRoomId, props.userId);
  const { status: playerStatus, controls: playerControls } = useMobilePlayerStatus();

  useEffect(() => {
    addEventListener('resize', () => {
      setPortrait(isPortrait);
    });
  }, []);

  if (portrait)
    return (
      <MobileAppLandscapeView
        queue={queue}
        queueControls={queueControls}
        playerStatus={playerStatus}
        playerControls={playerControls}
        host={props.host}
      />
    );
  return (
    <MobileAppPortraitView
      queue={queue}
      queueControls={queueControls}
      playerStatus={playerStatus}
      playerControls={playerControls}
      host={props.host}
    />
  );
};

export default MobileAppView;

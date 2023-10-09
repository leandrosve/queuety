import React, { useEffect, useState } from 'react';
import HostData from '../../../model/auth/HostData';
import MobileAppLandscapeView from './MobileAppLandscapeView';
import MobileAppPortraitView from './MobileAppPortraitView';
import useMobileQueue from '../../../hooks/queue/useMobileQueue';
import useMobilePlayerStatus from '../../../hooks/player/useMobilePlayerStatus';
import MobileJoiningRoomView from './connection/MobileJoiningRoomView';
import { useMobileAuthContext } from '../../../context/MobileAuthContext';
import { HostStatus } from '../../../hooks/connection/useMobileAuth';
import useLayoutBackdrop from '../../../hooks/layout/useLayoutBackdrop';

interface Props {
  playerRoomId: string;
  userId: string;
  host: HostData;
  joinedRoom: boolean;
}
const isPortrait = () => window.matchMedia('(orientation: landscape)').matches;

const MobileAppView = (props: Props) => {
  const [portrait, setPortrait] = useState(isPortrait());
  const { hostStatus } = useMobileAuthContext();
  const { queue, controls: queueControls } = useMobileQueue(props.playerRoomId, props.userId, props.joinedRoom, hostStatus);
  const { status: playerStatus, controls: playerControls, timeTimestamp } = useMobilePlayerStatus();
  const [showJoiningView, setShowJoiningView] = useState(true);
  useLayoutBackdrop(false);

  useEffect(() => {
    addEventListener('resize', () => {
      setPortrait(isPortrait);
    });
  }, []);

  useEffect(() => {
    if (props.joinedRoom && hostStatus == HostStatus.CONNECTED) {
      setShowJoiningView(false);
    }
  }, [hostStatus, props.joinedRoom]);

  if (showJoiningView) {
    return <MobileJoiningRoomView host={props.host} />;
  }

  if (portrait)
    return (
      <MobileAppLandscapeView
        queue={queue}
        queueControls={queueControls}
        playerStatus={playerStatus}
        playerControls={playerControls}
        host={props.host}
        timeTimestamp={timeTimestamp}
      />
    );
  return (
    <MobileAppPortraitView
      queue={queue}
      queueControls={queueControls}
      playerStatus={playerStatus}
      playerControls={playerControls}
      host={props.host}
      timeTimestamp={timeTimestamp}
    />
  );
};

export default MobileAppView;

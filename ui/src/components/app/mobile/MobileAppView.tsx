import { useEffect, useState } from 'react';
import HostData from '../../../model/auth/HostData';
import useMobileQueue from '../../../hooks/queue/useMobileQueue';
import useMobilePlayerStatus from '../../../hooks/player/useMobilePlayerStatus';
import MobileJoiningRoomView from './connection/MobileJoiningRoomView';
import { useMobileAuthContext } from '../../../context/MobileAuthContext';
import { HostStatus } from '../../../hooks/connection/useMobileAuth';
import useLayoutBackdrop from '../../../hooks/layout/useLayoutBackdrop';
import SearchModal from '../shared/search/SearchModal';
import MobileNotifications from './connection/MobileNotifications';
import MobileAppUnifiedView from './MobileAppUnifiedView';

interface Props {
  playerRoomId: string;
  userId: string;
  host: HostData;
  joinedRoom: boolean;
}

const MobileAppView = (props: Props) => {
  const { hostStatus } = useMobileAuthContext();
  const { queue, controls: queueControls } = useMobileQueue(props.playerRoomId, props.userId, props.joinedRoom, hostStatus);
  const { status: playerStatus, controls: playerControls } = useMobilePlayerStatus();
  const [showJoiningView, setShowJoiningView] = useState(true);

  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  useLayoutBackdrop(false);

  useEffect(() => {
    if (props.joinedRoom && hostStatus == HostStatus.CONNECTED) {
      setShowJoiningView(false);
    }
  }, [hostStatus, props.joinedRoom]);

  if (showJoiningView) {
    return <MobileJoiningRoomView host={props.host} />;
  }

  return (
    <>
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onPlay={queueControls.onAddNow}
        onPlayLast={queueControls.onAddLast}
        onPlayNext={queueControls.onAddNext}
      />
      <MobileNotifications />
      <MobileAppUnifiedView
        queue={queue}
        queueControls={queueControls}
        playerStatus={playerStatus}
        playerControls={playerControls}
        host={props.host}
        onOpenSearchModal={() => setIsSearchModalOpen(true)}
      />
    </>
  );
};

export default MobileAppView;

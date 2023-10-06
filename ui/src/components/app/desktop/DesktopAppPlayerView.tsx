import { useState } from 'react';
import Player from './player/Player';
import { Flex } from '@chakra-ui/react';
import DesktopQueue from './queue/DesktopQueue';
import useDesktopQueue from '../../../hooks/queue/useDesktopQueue';
import PlayerControlsBar from '../shared/player/PlayerControlsBar';
import useDesktopPlayer from '../../../hooks/player/useDesktopPlayer';
import SearchLinkButton from '../shared/search/SearchLinkButton';
import SearchModal from '../shared/search/SearchModal';
import PlayerDescription from './player/PlayerDescription';
import DesktopAppWelcome from './DesktopAppWelcome';
import { SettingsModalSetter } from '../shared/settings/SettingsModal';
import useLayoutBackdrop from '../../../hooks/layout/useLayoutBackdrop';
import { LayoutBackdropPicture } from '../../../context/LayoutContext';

interface Props {
  playerRoomId: string;
  userId: string;
  onOpenSettingsModal: SettingsModalSetter;
  onGoBack: () => void;
}
const DesktopAppPlayerView = ({ playerRoomId, userId, onOpenSettingsModal, onGoBack }: Props) => {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const { queue, controls: queueControls, updatePlayerState } = useDesktopQueue(playerRoomId, userId);
  // We need to ensure the container div is rendered before initializing the player
  const { controls: playerControls, status: playerStatus } = useDesktopPlayer(
    playerRoomId,
    queue.currentItem,
    queueControls.onSkip,
    updatePlayerState
  );
  useLayoutBackdrop(!queue?.length, LayoutBackdropPicture.DESKTOP_WELCOME);

  return (
    <Flex direction='column' gap={5} paddingTop={10} width={{ base: '95vw', md: 800, lg: 1000, xl: 1100 }}>
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onPlay={queueControls.onAddNow}
        onPlayLast={queueControls.onAddLast}
        onPlayNext={queueControls.onAddNext}
      />
      {!!queue.length && (
        <>
          <SearchLinkButton onClick={() => setIsSearchModalOpen(true)} />
          <DesktopQueue
            currentItem={queue.currentItem}
            currentIndex={queue.currentIndex}
            queue={queue.items}
            onClear={queueControls.onClear}
            onUpdate={queueControls.onChangeOrder}
            onRemove={queueControls.onRemove}
            onPlay={queueControls.onPlay}
            loop={queue.loop}
            onToggleLoop={queueControls.onToggleLoop}
          />
        </>
      )}
      {queue.currentItem ? (
        <>
          <Player
            queueItem={queue.currentItem}
            status={playerStatus}
            fullscreen={playerStatus.fullscreen}
            onFullscreenChange={playerControls.onFullscreenChange}
          />
          <PlayerDescription video={queue.currentItem.video} />
          <PlayerControlsBar status={playerStatus} queueControls={queueControls} playerControls={playerControls} />
        </>
      ) : (
        <DesktopAppWelcome onOpenSettingsModal={onOpenSettingsModal} onGoBack={onGoBack} onOpenSearchModal={() => setIsSearchModalOpen(true)} />
      )}
    </Flex>
  );
};

export default DesktopAppPlayerView;

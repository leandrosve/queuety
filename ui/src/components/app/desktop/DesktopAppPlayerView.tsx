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
import { SettingsModalElements, SettingsModalSections } from '../shared/settings/SettingsModal';

interface Props {
  playerRoomId: string;
  userId: string;
  onOpenSettingsModal: (section?: SettingsModalSections, focusElement?: SettingsModalElements) => void;
}
const DesktopAppPlayerView = ({ playerRoomId, userId, onOpenSettingsModal }: Props) => {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const { queue, controls: queueControls, updatePlayerState } = useDesktopQueue(playerRoomId, userId);
  // We need to ensure the container div is rendered before initializing the player
  const { controls: playerControls, status: playerStatus } = useDesktopPlayer(
    playerRoomId,
    queue.currentItem,
    queueControls.onSkip,
    updatePlayerState
  );

  return (
    <Flex direction='column' gap={5} paddingTop={10} width={{ base: '95vw', md: 800, lg: 1000, xl: 1100 }}>
      <SearchLinkButton onClick={() => setIsSearchModalOpen(true)} />
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onPlay={queueControls.onAddNow}
        onPlayLast={queueControls.onAddLast}
        onPlayNext={queueControls.onAddNext}
      />
      {!!queue.length && (
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
        <DesktopAppWelcome onOpenSettingsModal={onOpenSettingsModal} />
      )}
    </Flex>
  );
};

export default DesktopAppPlayerView;

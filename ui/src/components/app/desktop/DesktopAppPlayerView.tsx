import { useState } from 'react';
import Player from './player/Player';
import { Flex } from '@chakra-ui/react';
import DesktopQueue from './queue/DesktopQueue';
import PlayerBackdrop from './player/PlayerBackdrop';
import useDesktopQueue from '../../../hooks/queue/useDesktopQueue';
import PlayerControlsBar from '../shared/player/PlayerControlsBar';
import useDesktopPlayer from '../../../hooks/player/useDesktopPlayer';
import SearchLinkButton from '../shared/search/SearchLinkButton';
import SearchModal from '../shared/search/SearchModal';
import PlayerDescription from './player/PlayerDescription';
import backgroundImage from '../../../assets/images/background.jpg';
interface Props {
  playerRoomId: string;
  userId: string;
}
const DesktopAppPlayerView = ({ playerRoomId, userId }: Props) => {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const { queue, controls: queueControls } = useDesktopQueue(playerRoomId, userId);
  // We need to ensure the container div is rendered before initializing the player
  const { controls: playerControls, status: playerStatus } = useDesktopPlayer(playerRoomId, queue.currentItem, queueControls.onSkip);
  return (
    <Flex direction='column' gap={5} paddingTop={10}>
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
        />
      )}
      {queue.currentItem ? (
        <>
          <Player queueItem={queue.currentItem} status={playerStatus} />
          <PlayerDescription video={queue.currentItem.video} />
          <PlayerControlsBar status={playerStatus} queueControls={queueControls} playerControls={playerControls} />
        </>
      ) : (
        <DesktopAppWelcome />
      )}
    </Flex>
  );
};

const DesktopAppWelcome = () => {
  return (
    <Flex direction='column' gap={3} alignItems='center' justifyContent='center' height={500} width={{ base: '95vw', md: 750, lg: 900 }}>
      Welcome!
      <PlayerBackdrop state={1} image={backgroundImage} />
    </Flex>
  );
};

export default DesktopAppPlayerView;

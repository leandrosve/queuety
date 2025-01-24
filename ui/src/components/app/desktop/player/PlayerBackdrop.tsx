import { Box, Flex } from '@chakra-ui/react';
import './player-backdrop.css';
import { useEffect, useMemo, useState } from 'react';
import { useSettingsContext } from '../../../../context/SettingsContext';
import classNames from 'classnames';
interface Props {
  videoId?: string;
  image?: string;
  state: number;
}

enum PlayerState {
  ENDED = 0,
  PLAYING = 1,
  PAUSED = 2,
  BUFFERING = 3,
  CUED = 4,
}

const PlayerBackdrop = (props: Props) => {
  const { settings } = useSettingsContext();
  if (!settings.appearance.glassMode) return <></>;
  return <Backdrop {...props} />;
};

const Backdrop = ({ videoId, image, state }: Props) => {
  const animate = useMemo(() => [PlayerState.PLAYING, PlayerState.BUFFERING].includes(state), [state]);

  const [sources, setSources] = useState<{ sourceA?: string; sourceB?: string; index: number }>({ index: 0 });

  useEffect(() => {
    const newSource = image ?? `https://img.youtube.com/vi/${videoId}/sddefault.jpg`;
    setSources((prev) => {
      return {
        index: prev.index + 1,
        sourceA: prev.index % 2 == 0 ? newSource : prev.sourceA,
        sourceB: prev.index % 2 == 1 ? newSource : prev.sourceB,
      };
    });
  }, [videoId, image]);

  return (
    <Flex className={`player-backdrop ${animate ? 'animate' : ''}`}>
      <div className='player-backdrop__image-container'>
        <img src={sources.sourceA} className={classNames('player-backdrop__image', { 'fade-in': !!(sources.index % 2) })} />
        <img src={sources.sourceB} className={classNames('player-backdrop__image', { 'fade-in': !(sources.index % 2) })} />
      </div>
      <Box className='player-backdrop__blur'></Box>
    </Flex>
  );
};

export default PlayerBackdrop;

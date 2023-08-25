import { Box, Button, Fade } from '@chakra-ui/react';
import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { LuMinimize } from 'react-icons/lu';

interface Props {
  onFullscreenChange: (open: boolean) => void;
}
const PlayerFullScreenOverlay = ({ onFullscreenChange }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isMovingMouse, setIsMovingMouse] = useState(false);
  const [isOverButton, setIsOverButton] = useState(false);

  useEffect(() => {
    ref.current?.addEventListener('mousemove', () => {
      console.log('MOUS MOVED');
      setIsMovingMouse(true);
    });
    document.addEventListener('fullscreenchange', () => {
      onFullscreenChange(false);
    });
  }, [ref]);

  useEffect(() => {
    let timeout: number;
    timeout = setTimeout(() => {
      setIsMovingMouse(false);
    }, 4000);
    () => clearTimeout(timeout);
  }, [isMovingMouse]);

  return (
    <Box ref={ref} className={classNames('player-fullscreen-overlay', { isMovingMouse })}>
      <Fade in={isMovingMouse || isOverButton}>
        <Button
          size='lg'
          leftIcon={<LuMinimize />}
          onMouseEnter={() => setIsOverButton(true)}
          onMouseLeave={() => setIsOverButton(false)}
          onClick={() => onFullscreenChange(false)}
        >
          Exit Fullscreen
        </Button>
      </Fade>
    </Box>
  );
};

export default PlayerFullScreenOverlay;

import { useColorMode } from '@chakra-ui/react';
import { useLayoutContext } from '../../../context/LayoutContext';
import { useEffect, useState } from 'react';
import VisualizerBackdrop from '../../app/mobile/visualizer/VisualizerBackdrop';
/**
 * Semi-automatic backdrop handled by context
 */
const LayoutBackdrop = () => {
  const { colorMode } = useColorMode();
  const { backdrop, pictures } = useLayoutContext();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    setInitialized(true);
  }, []);

  if (!initialized || !backdrop || !pictures) return null;
  return <VisualizerBackdrop src={colorMode == 'dark' ? pictures.dark : pictures.light} variant='welcome' />;
};
export default LayoutBackdrop;

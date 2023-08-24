import { Flex } from '@chakra-ui/react';
import './visualizer.css';
import { useState, useEffect } from 'react';
import classNames from 'classnames';
import { useSettingsContext } from '../../../../context/SettingsContext';

const VisualizerBackdrop = ({ src }: { src: string }) => {
  const { settings } = useSettingsContext();
  if (!settings.appearance.glassMode) return null;
  return <Backdrop src={src} />;
};
const Backdrop = ({ src }: { src: string }) => {
  const [state, setState] = useState<{ sourceA?: string; sourceB?: string; index: number }>({ index: 0 });

  useEffect(() => {
    setState((prev) => {
      return {
        index: prev.index + 1,
        sourceA: prev.index % 2 == 0 ? src : prev.sourceA,
        sourceB: prev.index % 2 == 1 ? src : prev.sourceB,
      };
    });
  }, [src]);
  return (
    <Flex className={classNames('visualizer-backdrop')}>
      <img src={state.sourceA} className={`visualizer-backdrop-img first-image ${state.index % 2 ? 'fade-in' : ''}`} />
      <img src={state.sourceB} className={`visualizer-backdrop-img second-image ${!(state.index % 2) ? 'fade-in' : ''}`} />
    </Flex>
  );
};

export default VisualizerBackdrop;

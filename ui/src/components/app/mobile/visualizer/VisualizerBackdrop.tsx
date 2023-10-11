import { Flex } from '@chakra-ui/react';
import './visualizer.css';
import { useState, useEffect, useCallback } from 'react';
import classNames from 'classnames';
import { useSettingsContext } from '../../../../context/SettingsContext';

interface Props {
  variant?: 'normal' | 'welcome';
  src: string;
  zIndex?: number;
}
const VisualizerBackdrop = (props: Props) => {
  const { settings } = useSettingsContext();
  if (!settings.appearance.glassMode) return null;
  return <Backdrop {...props} />;
};

interface BackdropState {
  a: {
    src?: string;
    loaded: boolean;
  };
  b: {
    src?: string;
    loaded: boolean;
  };
  index: number;
}

const Backdrop = ({ src, zIndex, variant = 'normal' }: Props) => {
  const [state, setState] = useState<BackdropState>({ index: 0, a: { loaded: false }, b: { loaded: false } });

  const handleLoaded = useCallback((option: 'a' | 'b') => {
    setState((p) => {
      if (option === 'a') {
        return { ...p, a: { ...p.a, loaded: true } };
      }
      return { ...p, b: { ...p.b, loaded: true } };
    });
  }, []);

  useEffect(() => {
    setState((prev) => {
      return {
        index: prev.index + 1,
        a: prev.index % 2 == 0 && prev.a.src !== src ? { src, loaded: false } : prev.a,
        b: prev.index % 2 == 1 && prev.b.src !== src ? { src, loaded: false } : prev.b,
      };
    });
  }, [src]);

  return (
    <Flex className={classNames('visualizer-backdrop', variant)} zIndex={zIndex}>
      <img
        src={state.a.src}
        onLoad={() => handleLoaded('a')}
        className={classNames('visualizer-backdrop-img', ' first-image', { 'fade-in': state.index % 2, loaded: state.a.loaded })}
      />
      <img
        src={state.b.src}
        onLoad={() => handleLoaded('b')}
        className={classNames('visualizer-backdrop-img', 'second-image', { 'fade-in': !(state.index % 2), loaded: state.b.loaded })}
      />
    </Flex>
  );
};

export default VisualizerBackdrop;

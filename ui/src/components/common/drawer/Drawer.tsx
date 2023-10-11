import { Box, BoxProps, Fade } from '@chakra-ui/react';
import { PropsWithChildren, useEffect } from 'react';
import './drawer.css';
import classNames from 'classnames';
interface Props extends PropsWithChildren {
  onClose: () => void;
  isOpen: boolean;
  contentProps?: BoxProps;
}
const Drawer = ({ isOpen, onClose, contentProps, children }: Props) => {
  useEffect(() => {
    if (isOpen) {
      document.documentElement.setAttribute('data-drawer-open', 'true');
      return;
    }
    document.documentElement.removeAttribute('data-drawer-open');
  }, [isOpen]);

  return (
    <Box className={classNames('drawer', { open: isOpen, close: !isOpen })}>
      <Fade in={isOpen}>
        <div className='drawer-overlay' onClick={onClose} />
      </Fade>
      <Box className='drawer-content' {...contentProps}>
        {children}
      </Box>
    </Box>
  );
};

export default Drawer;

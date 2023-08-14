import { Box, Flex, FlexProps } from '@chakra-ui/react';
import classNames from 'classnames';
import './glass.css';

interface Props extends FlexProps {
  asBefore?: boolean; // Place the context as the background and negative z-index
}
const GlassContainer = ({ children, className, asBefore, ...props }: Props) => {
  return (
    <Box className={classNames('glass-container', className, { 'as-before': asBefore })} {...props}>
      {children}
    </Box>
  );
};

export default GlassContainer;

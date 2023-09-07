import { Box, BoxProps } from '@chakra-ui/react';
import React, { useCallback } from 'react';

interface Props extends BoxProps {
  onSubmit: () => void;
}

const Form = ({ children, onSubmit, ...props }: Props) => {
  const handleSubmit: React.FormEventHandler<HTMLDivElement> = useCallback((e) => {
    e.preventDefault();
    onSubmit();
  }, [onSubmit]);
  return (
    <Box as='form' {...props} onSubmit={handleSubmit}>
      {children}
    </Box>
  );
};

export default Form;

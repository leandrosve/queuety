import { defineStyle, defineStyleConfig } from '@chakra-ui/react';

const ghost = defineStyle({
  _light: {
    _hover: { background: 'blackAlpha.100' },
  },
});

const outline = defineStyle({
  _light: {
    borderColor: 'borders.100',
    _hover: { background: 'blackAlpha.100' },
    _active: { background: 'blackAlpha.100' },
  },
});

const alpha = defineStyle({
  background: 'blackAlpha.100',
  color: 'text.500',
  _hover: { background: 'blackAlpha.200' },
  _active: { background: 'blackAlpha.300' },
  _dark: {
    background: 'whiteAlpha.100',
    color: 'text.500',
    _hover: { background: 'whiteAlpha.200' },
    _active: { background: 'whiteAlpha.300' },
  },
});

export const buttonTheme = defineStyleConfig({
  defaultProps: {
    variant: 'alpha',
  },
  variants: { ghost, outline, alpha },
});

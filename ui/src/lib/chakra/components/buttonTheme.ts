import { defineStyle, defineStyleConfig } from '@chakra-ui/react';

const solid = defineStyle({
  _light: {
    background: 'blackAlpha.100',
    _hover: { background: 'blackAlpha.200' },
    _active: { background: 'blackAlpha.300' },
  },
});

const ghost = defineStyle({
  _light: {
    _hover: { background: 'blackAlpha.100' },
  },
});

export const buttonTheme = defineStyleConfig({
  variants: { solid, ghost },
});

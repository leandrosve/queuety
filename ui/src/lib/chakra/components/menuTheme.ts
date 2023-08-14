import { menuAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers, defineStyle } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(menuAnatomy.keys);
/* Some extra styling done in css file */
const baseStyle = definePartsStyle({
  list: {
    p: '2',
    borderRadius: 'xl',
    border: 'none',
    bg: 'bg.500',
  },
  item: {
    bg: 'transparent',
    borderRadius: 'lg',
  },
});
export const menuTheme = defineMultiStyleConfig({ baseStyle });

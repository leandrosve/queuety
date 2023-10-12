import { menuAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(menuAnatomy.keys);
/* Some extra styling done in css file */
const baseStyle = definePartsStyle({
  list: {
    p: '2',
    borderRadius: 'xl',
    border: 'none',
    bg: 'transparent',
    boxShadow: 'lg',
  },
  item: {
    bg: 'transparent',
    borderRadius: 'lg',
  },
});
export const menuTheme = defineMultiStyleConfig({ baseStyle });

import { cssVar, defineStyle, defineStyleConfig } from '@chakra-ui/react';
const $startColor = cssVar('skeleton-start-color');
const $endColor = cssVar('skeleton-end-color');

const def = defineStyle({
  _light: {
    [$startColor.variable]: 'colors.blackAlpha.300', //changing startColor to red.100
    [$endColor.variable]: 'colors.blackAlpha.200', // changing endColor to red.400
  },
  _dark: {
    [$startColor.variable]: 'colors.whiteAlpha.100', //changing startColor to red.800
    [$endColor.variable]: 'colors.whiteAlpha.300', // changing endColor to red.600
  },
});

export const skeletonTheme = defineStyleConfig({
  defaultProps: {
    variant: 'default',
  },
  variants: { default: def },
});

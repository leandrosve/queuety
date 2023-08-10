import { extendTheme } from '@chakra-ui/react';
import { menuTheme } from './components/menuTheme';
import './chakraTheme.css';

const theme = extendTheme({
  components: {
    Menu: menuTheme,
  },
  fonts: {
    heading: 'var(--font-family)',
    body: 'var(--font-family)',
  },
  styles: {
    global: {
      body: {
        bg: 'var(--bg-100)',
        color: 'var(--text-500)',
      },
    },
  },
  colors: {
    primary: {
      50: 'var(--primary-50)',
      100: 'var(--primary-100)',
      200: 'var(--primary-200)',
      300: 'var(--primary-300)',
      400: 'var(--primary-400)',
      500: 'var(--primary-500)',
      600: 'var(--primary-600)',
      700: 'var(--primary-700)',
      800: 'var(--primary-800)',
      900: 'var(--primary-900)',
    },
    text: {
      300: 'var(--text-300)',
      500: 'var(--text-500)',
      600: 'var(--text-600)',
    },

    bg: {
      100: 'var(--bg-100)',
      200: 'var(--bg-200)',
      300: 'var(--bg-300)',
      400: 'var(--bg-400)',
      500: 'var(--bg-500)',
    },
    bgAlpha: {
      100: 'var(--bg-alpha-100)',
      200: 'var(--bg-alpha-200)',
      300: 'var(--bg-alpha-300)',
    },
  },
});

export default theme;

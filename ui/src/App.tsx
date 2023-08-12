import './assets/css/app.css';
import { ChakraProvider, useMediaQuery } from '@chakra-ui/react';
import theme from './lib/chakra/chakraTheme';
import './i18n/i18n';
import DesktopApp from './components/app/DesktopApp';
import { SettingsProvider } from './context/SettingsContext';
import MobileApp from './components/app/MobileApp';

function App() {
  // Set SSR to false, otherwise it's wrong the first render
  const [isMobile] = useMediaQuery('(max-width: 800px)', { fallback: false, ssr: false });

  return (
    <ChakraProvider theme={theme}>
      <SettingsProvider>
        <div className='app'>{isMobile ? <MobileApp /> : <DesktopApp />}</div>
      </SettingsProvider>
    </ChakraProvider>
  );
}

export default App;

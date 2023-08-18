import './assets/css/app.css';
import { ChakraProvider, useMediaQuery } from '@chakra-ui/react';
import theme from './lib/chakra/chakraTheme';
import './i18n/i18n';
import DesktopApp from './components/app/desktop/DesktopApp';
import { SettingsProvider } from './context/SettingsContext';
import MobileApp from './components/app/mobile/MobileApp';
import { useEffect, useState } from 'react';

function App() {
  // This damn hooks always run twice for some reason
  const [initialized, setInitialized] = useState(false);
  const [isMobile] = useMediaQuery('(max-width: 800px)', { fallback: false });
  useEffect(() => {
    setInitialized(true);
  }, [isMobile]);
  if (!initialized) return null;
  return (
    <ChakraProvider theme={theme}>
      <SettingsProvider>
        <div className='app'>{isMobile ? <MobileApp /> : <DesktopApp />}</div>
      </SettingsProvider>
    </ChakraProvider>
  );
}

export default App;

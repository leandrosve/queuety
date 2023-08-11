import './assets/css/app.css';
import { ChakraProvider } from '@chakra-ui/react';
import theme from './lib/chakra/chakraTheme';
import Layout from './components/layout/Layout';
import './i18n/i18n';
import PlayerDesktopView from './components/player/desktop/PlayerDesktopView';
import PlayerQueue from './components/player/queue/PlayerQueue';
import { SettingsProvider } from './context/SettingsContext';
import { PlayerQueueProvider } from './context/PlayerQueueContext';

function App() {
  return (
      <ChakraProvider theme={theme}>
        <SettingsProvider>
          <Layout>
            <PlayerDesktopView />
          </Layout>
        </SettingsProvider>
      </ChakraProvider>
  );
}

export default App;

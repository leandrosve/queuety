import './assets/css/app.css';
import { ChakraProvider } from '@chakra-ui/react';
import theme from './lib/chakra/chakraTheme';
import Layout from './components/layout/Layout';
import ConnectionHostView from './components/connection/ConnectionHostView';
import './i18n/i18n';
import PlayerDesktopView from './components/player/desktop/PlayerDesktopView';
import PlayerQueue from './components/player/queue/PlayerQueue';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Layout>
        <PlayerQueue />
      </Layout>
    </ChakraProvider>
  );
}

export default App;

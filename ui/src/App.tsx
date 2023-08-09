import './assets/css/app.css';
import { ChakraProvider } from '@chakra-ui/react';
import theme from './lib/chakra/chakraTheme';
import Layout from './components/layout/Layout';
import ConnectionHostView from './components/connection/ConnectionHostView';
import './i18n/i18n';
import PlayerDesktopView from './components/player/desktop/PlayerDesktopView';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Layout>
        <PlayerDesktopView/>
      </Layout>
    </ChakraProvider>
  );
}

export default App;

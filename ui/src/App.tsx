import './assets/css/app.css';
import Player from './components/player/Player';
import { ChakraProvider, Flex } from '@chakra-ui/react';
import PlayerProvider from './components/player/PlayerProvider';
import PlayerSearch from './components/player/search/PlayerSearch';
import theme from './lib/chakra/chakraTheme';
import Layout from './components/layout/Layout';
import PlayerDesktopView from './components/player/desktop/PlayerDesktopView';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Layout>
        <PlayerDesktopView />
      </Layout>
    </ChakraProvider>
  );
}

export default App;

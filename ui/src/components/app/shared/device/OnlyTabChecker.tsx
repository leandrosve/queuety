import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import { useEffect, useState, PropsWithChildren } from 'react';
import PlayerBackdrop from '../../desktop/player/PlayerBackdrop';
import backdrop from '../../../../assets/images/background.jpg';

const ommit = true;
const OnlyTabChecker = ({ children }: PropsWithChildren) => {
  const [showError, setShowError] = useState(false);
  useEffect(() => {
    if (ommit) return;
    const channel = new BroadcastChannel('tab');
    channel.postMessage('another-tab');
    // note that listener is added after posting the message
    channel.addEventListener('message', (msg) => {
      if (msg.data === 'another-tab') {
        // message received from 2nd tab
        setShowError(true);
      }
    });
  }, []);

  if (showError)
    return (
      <Flex grow={1} alignItems='center' justifyContent='center' direction='column' flex='1 1 0' minHeight={0}>
        <Flex alignItems='center' justifyContent='center' direction='column' zIndex={1}>
          <Text fontSize='lg'>It appears the page was opened from another tab</Text>
          <Heading>Queuety</Heading>
          <Box opacity={0.3} zIndex={-1}>
            <PlayerBackdrop image={backdrop} state={1} />
          </Box>
        </Flex>
      </Flex>
    );
  return children;
};

export default OnlyTabChecker;

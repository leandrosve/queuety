import { Button, Flex, Heading, Tag, Text } from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import { useDesktopAuthContext } from '../../../../context/DesktopAuthContext';
import StorageUtils, { StorageKey } from '../../../../utils/StorageUtils';

const DesktopConnectionView = () => {
  const { connectionId, authRoom, playerRoom, isSocketReady } = useDesktopAuthContext();
  const [isOpen, setIsOpen] = useState(false);
  const toggleOpen = (open?: boolean) => {
    setIsOpen((p) => {
      const next = open !== undefined ? open : !p;
      StorageUtils.set(StorageKey.DEBUG_MODE, `${next}`);
      return next;
    });
  };

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    // check if the Shift key is pressed
    if (event.shiftKey && event.ctrlKey && (event.key === '+' || event.key === '*')) {
      toggleOpen();
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
  }, []);

  if (!isOpen) return null;

  return (
    <Flex zIndex={5000} direction='column' gap={3} position='absolute' bottom={3} left={3} padding={5} background='bg.100' boxShadow='sm'>
      <Heading>Desktop</Heading>

      <Tag colorScheme={isSocketReady ? 'green' : 'red'}>Socket Status: {isSocketReady ? 'CONNECTED' : 'DISCONNECTED'}</Tag>
      <Tag>Connection ID: {connectionId}</Tag>
      <Text>Auth Room:</Text>
      <Tag>
        {authRoom.id} - {authRoom.joined ? 'joined' : 'not joined'}
      </Tag>
      <Text>Player Room:</Text>
      <Tag>
        {playerRoom.id} - {playerRoom.joined ? 'joined' : 'not joined'}
      </Tag>
      <Button
        marginTop={5}
        onClick={() => {
          StorageUtils.clear();
          location.reload();
        }}
      >
        Clear Storage
      </Button>
    </Flex>
  );
};

export default DesktopConnectionView;

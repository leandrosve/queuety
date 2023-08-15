import { Button, Flex, Heading, Input, Tag, Text } from '@chakra-ui/react';
import { AuthResponseStatus } from '../../../model/auth/AuthResponse';
import { useCallback, useEffect, useState } from 'react';
import { useDesktopAuthContext } from '../../../context/DesktopAuthContext';

const DesktopConnectionView = () => {
  const { connectionId, authRoom, playerRoom, isSocketReady, authRequests, authorizeRequest } = useDesktopAuthContext();
  const [isOpen, setIsOpen] = useState(false);
  const toggleOpen = (open?: boolean) => {
    setIsOpen((p) => {
      const next = open !== undefined ? open : !p;
      localStorage.setItem('debugMode', `${next}`);
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
      <Text>Requests:</Text>
      {authRequests.list.map((r, index) => (
        <Text key={index}>
          {JSON.stringify(r)} <Button onClick={() => authorizeRequest(r, AuthResponseStatus.AUTHORIZED)}>Accept</Button>{' '}
          <Button onClick={() => authorizeRequest(r, AuthResponseStatus.DENIED)}>Deny</Button>
        </Text>
      ))}
      <Button
        marginTop={5}
        onClick={() => {
          localStorage.clear();
          location.reload();
        }}
      >
        Clear Storage
      </Button>
    </Flex>
  );
};

export default DesktopConnectionView;

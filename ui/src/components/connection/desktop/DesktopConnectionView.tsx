import { Button, Flex, Heading, Input, Tag, Text } from '@chakra-ui/react';
import useDesktopAuth from '../../../hooks/connection/useDesktopAuth';

const DesktopConnectionView = () => {
  const { joinedAuthRoom, connectionId, authRoomId, isSocketReady, authRequests, authorizeRequest } = useDesktopAuth();
  return (
    <Flex direction='column' gap={3}>
      <Heading>Desktop</Heading>

      <Tag colorScheme={isSocketReady ? 'green' : 'red'}>Socket Status: {isSocketReady}</Tag>
      <Tag>Connection ID: {connectionId}</Tag>
      <Text>Auth Room:</Text>
      <Tag>
        {authRoomId} - {joinedAuthRoom ? 'joined' : 'not joined'}
      </Tag>
      <Text>Requests:</Text>
      {authRequests.map((r, index) => (
        <Text key={index}>
          {JSON.stringify(r)} <Button onClick={() => authorizeRequest(r.clientId, true)}>Accept</Button>{' '}
          <Button onClick={() => authorizeRequest(r.clientId, false)}>Deny</Button>
        </Text>
      ))}
    </Flex>
  );
};

export default DesktopConnectionView;

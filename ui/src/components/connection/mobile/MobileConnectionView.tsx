import { Button, Flex, Heading, Input, Tag, Text } from '@chakra-ui/react';
import React, { useRef, useState } from 'react';
import useMobileAuth, { Status } from '../../../hooks/connection/useMobileAuth';

const MobileConnectionView = () => {
  const [authRoomId, setAuthRoomId] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);
  const auth = useMobileAuth(authRoomId);
  return (
    <Flex direction='column' gap={3}>
      <Heading>Mobile</Heading>
      <Tag colorScheme={auth.isSocketReady ? 'green' : 'red'}>Socket Status: {auth.isSocketReady}</Tag>
      <Tag>Connection ID: {auth.connectionId}</Tag>
      <Text>Auth Room:</Text>
      <Tag>{auth.authRoomId}</Tag>
      <Text>Player Room:</Text>
      <Tag>{auth.playerRoomId}</Tag>
      <Text>Step</Text>
      <Tag colorScheme='cyan'>{auth.status}</Tag>
      <Flex>
        <Input ref={inputRef} placeholder='Auth Room ID' borderRightRadius={0} />
        <Button borderLeftRadius={0} onClick={(e) => setAuthRoomId(inputRef.current?.value || '')}>
          Join
        </Button>
      </Flex>
    </Flex>
  );
};

export default MobileConnectionView;

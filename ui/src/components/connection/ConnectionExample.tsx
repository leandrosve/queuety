import React, { useState, useEffect, useRef } from 'react';
import { socket } from '../../socket';
import { Button, Flex, Heading, Input, Tag } from '@chakra-ui/react';
import Logger from '../../utils/Logger';

export const MobileConnectionExample = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [joinedRoom, setJoinedRoom] = useState<string>();

  const [id, setId] = useState<string>();

  const [messages, setMessages] = useState<{ message: string }[]>([]);
  const joinRoomRef = useRef<HTMLInputElement>(null);

  const idRef = useRef<HTMLInputElement>(null);

  const sendMessage = () => {
    const payload = { message: idRef.current?.value, room: joinedRoom };

    socket.emit('send-message', payload, (ack: boolean) => {
      if (!ack) return;
      Logger.info('Message sent', ack);
      setMessages((p) => [...p, {message: payload.message || ''}]);
    });
  };

  const joinRoom = (room: string) => {
    const payload = { room: room };
    socket.emit('join-room', payload, (ack: boolean) => {
      if (!ack) return;
      Logger.info('Message sent', ack);
      setJoinedRoom(payload.room || '');
      localStorage.setItem('room', room);
    });
  };

  useEffect(() => {
    const onConnect = (ownId?: string) => {
      setIsConnected(true);
      setId(ownId);
      const room = localStorage.getItem('room') || '';
      if (room) joinRoom(room);
    };
    const onDisconnect = () => setIsConnected(false);
    const onMessageReceived = (value: any) => {
      console.log('whyy');
      setMessages((p) => [...p, value]);
    };

    socket.on('connection', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('message-received', onMessageReceived);

    console.log('connect');
    socket.connect();

    return () => {
      console.log('disconnect');
      socket.off('connection', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('message-received', onMessageReceived);
    };
  }, []);

  return (
    <Flex direction='column' gap={2}>
      <Heading>Mobile ({isConnected ? 'connected' : 'disconnected'})</Heading>
      {id && <Tag>ID: {id}</Tag>}
      {joinedRoom && <Tag colorScheme='cyan'>Room ID: {joinedRoom}</Tag>}
      <Flex>
        <Input ref={joinRoomRef} placeholder='Join Room' borderRightRadius={0} />{' '}
        <Button borderLeftRadius={0} onClick={() => joinRoom(joinRoomRef.current?.value || '')}>
          Join
        </Button>
      </Flex>
      <Input ref={idRef} placeholder='message' />
      <Button onClick={sendMessage}>Send</Button>
      <br />
      Messages Received: <br />
      {messages.map((e, index) => (
        <p key={index}>{`${e.message}`}</p>
      ))}
    </Flex>
  );
};

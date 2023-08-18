import { Button, Flex, Heading, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, Tag, Text } from '@chakra-ui/react';
import { useRef, useState, useEffect, useCallback } from 'react';
import { useMobileAuthContext } from '../../../../context/MobileAuthContext';

const MobileConnectionDebugModal = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(localStorage.getItem('debugMode') == 'true');
  const auth = useMobileAuthContext();
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
  return (
    <Modal isOpen={isOpen} onClose={() => toggleOpen(false)}>
      <ModalOverlay />
      <ModalCloseButton />
      <ModalContent>
        <ModalBody>
          <Flex direction='column' gap={3}>
            <Heading>Mobile</Heading>
            <Tag colorScheme={auth.isSocketReady ? 'green' : 'red'}>Socket Status: {auth.isSocketReady ? 'CONNECTED' : 'DISCONNECTED'}</Tag>
            {auth.error && <Tag colorScheme={'red'}>Error: {auth.error}</Tag>}
            <Tag>Connection ID: {auth.connectionId}</Tag>
            <Text>Auth Room:</Text>
            <Tag wordBreak='break-all'>{auth.authRoomId}</Tag>
            <Text>Player Room:</Text>
            <Tag wordBreak='break-all'>{auth.playerRoomId}</Tag>
            <Text>User ID:</Text>
            <Tag wordBreak='break-all'>{auth.userId}</Tag>
            <Text>Connection Step</Text>
            <Tag colorScheme='cyan'>{auth.status}</Tag>
            <Flex>
              <Input ref={inputRef} placeholder='Auth Room ID' borderRightRadius={0} />
              <Button borderLeftRadius={0} onClick={() => auth.onTrigger(inputRef.current?.value || '')}>
                Join
              </Button>
            </Flex>
            <Button marginTop={5} onClick={() => localStorage.clear()}>
              Clear Storage
            </Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default MobileConnectionDebugModal;

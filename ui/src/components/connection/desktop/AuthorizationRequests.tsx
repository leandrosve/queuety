import { Box, Button, Flex, Stack, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import AuthRequest from '../../../model/auth/AuthRequest';
import AutoAvatar from '../../common/AutoAvatar';
import GlassContainer from '../../common/glass/GlassContainer';
import { motion, AnimatePresence } from 'framer-motion';
import { useDesktopAuthContext } from '../../../context/DesktopAuthContext';
import { AuthResponseStatus } from '../../../model/auth/AuthResponse';

const AuthorizationRequests = () => {
  const { authRequests, authorizeRequest } = useDesktopAuthContext();
  return (
    <Box position='fixed' bottom='0' left='1rem' width={600} maxWidth={"50vw"} zIndex={'var(--z-index-toast)'}>
      <AnimatePresence>
        {authRequests.list.map((request) => (
          <motion.div
            style={{ maxHeight: 'fit-content', overflow: 'hidden' }}
            key={request.userId}
            initial={{  scaleY: 0, height: 0 }}
            animate={{  scaleY: 1, height: 'auto' }}
            exit={{scaleY: 0, height: 0 }}
          >
            <GlassContainer padding={4} borderRadius='lg' boxShadow='md' marginY={2}>
              <Flex gap={3} grow={1}>
                <AutoAvatar name={request.nickname} boxSize='2rem' />

                <Flex direction='column' grow={1}>
                  <Text color='text.300' lineHeight='shorter' as='span' fontSize='xs' fontWeight='bold'>
                  #{request.userId.slice(-5)}
                  </Text>
                  <Text lineHeight='shorter'>
                    <b>{request.nickname}</b> está solicitando conectarse a la cola
                  </Text>

                  <Flex gap={3} marginLeft='auto' marginTop={2} wrap='wrap'>
                    <Button onClick={() => authorizeRequest(request, AuthResponseStatus.DENIED)}>Rechazar</Button>
                    <Button
                      onClick={() => authorizeRequest(request, AuthResponseStatus.AUTHORIZED)}
                      variant='solid'
                      colorScheme='primary'
                    >
                      Aceptar
                    </Button>
                  </Flex>
                </Flex>
              </Flex>
            </GlassContainer>
          </motion.div>
        ))}
      </AnimatePresence>
    </Box>
  );
};

export default AuthorizationRequests;

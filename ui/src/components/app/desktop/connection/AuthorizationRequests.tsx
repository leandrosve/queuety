import { Box, Button, Flex, Icon, Text } from '@chakra-ui/react';
import { useState } from 'react';
import AuthRequest from '../../../../model/auth/AuthRequest';
import AutoAvatar from '../../../common/AutoAvatar';
import GlassContainer from '../../../common/glass/GlassContainer';
import { motion, AnimatePresence } from 'framer-motion';
import { useDesktopAuthContext } from '../../../../context/DesktopAuthContext';
import { AuthResponseStatus } from '../../../../model/auth/AuthResponse';
import { LuCheckCircle } from 'react-icons/lu';
import { useAuthRequestsContext } from '../../../../context/AuthRequestsContext';
import FormatUtils from '../../../../utils/FormatUtils';
import { Trans, useTranslation } from 'react-i18next';

const AuthorizationRequests = () => {
  const { authorizeRequest } = useDesktopAuthContext();
  const authRequests = useAuthRequestsContext();
  return (
    <Box position='fixed' bottom='0' left='1rem' width={600} maxWidth={'50vw'} zIndex={'var(--z-index-toast)'}>
      <AnimatePresence>
        {authRequests.list.map((request) => (
          <Item
            key={request.userId}
            request={request}
            onAccept={() => authorizeRequest(request, AuthResponseStatus.AUTHORIZED)}
            onDeny={() => authorizeRequest(request, AuthResponseStatus.DENIED)}
          />
        ))}
      </AnimatePresence>
    </Box>
  );
};

interface AuthorizationRequestItemProps {
  request: AuthRequest;
  onAccept: () => void;
  onDeny: () => void;
}
const Item = ({ request, onAccept, onDeny }: AuthorizationRequestItemProps) => {
  const [accepted, setAccepted] = useState(false);
  const handleAccept = () => {
    if (accepted) return;
    setAccepted(true);
    onAccept();
  };

  return (
    <motion.div
      style={{ maxHeight: 'fit-content', overflow: 'hidden' }}
      key={request.userId}
      initial={{ scaleY: 0, height: 0 }}
      animate={{ scaleY: 1, height: 'auto' }}
      exit={{ scaleY: 0, height: 0, transition: { delay: accepted ? 0.8 : 0 } }}
    >
      <GlassContainer padding={4} borderRadius='lg' boxShadow='md' marginY={2}>
        <AuthorizationRequestItem onAccept={handleAccept} onDeny={onDeny} request={request} />
      </GlassContainer>
    </motion.div>
  );
};

export const AuthorizationRequestItem = ({ request, onAccept, onDeny }: AuthorizationRequestItemProps) => {
  const { t } = useTranslation();
  const [accepted, setAccepted] = useState(false);
  const handleAccept = () => {
    if (accepted) return;
    setAccepted(true);
    onAccept();
  };

  return (
    <Flex gap={3} grow={1}>
      <AutoAvatar name={request.nickname} boxSize='2rem' />
      <Flex direction='column' grow={1}>
        <Text color='text.300' lineHeight='shorter' as='span' fontSize='xs' fontWeight='bold'>
          {FormatUtils.shortenUserId(request.userId)}
        </Text>
        <Text lineHeight='shorter'>
          <Trans i18nKey={'connection.userRequest'} components={[<b></b>]} values={{ nickname: request.nickname }} />
        </Text>
        <Flex gap={3} marginLeft='auto' marginTop={2} wrap='wrap'>
          <Button opacity={accepted ? 0 : 1} transition='opacity 200ms' onClick={onDeny}>
            {t('connection.reject')}
          </Button>
          <Button
            onClick={handleAccept}
            variant='solid'
            colorScheme='primary'
            position='relative'
            transition='background 500ms'
            background={accepted ? `primary.500` : undefined}
          >
            <Text as='span' opacity={accepted ? 0 : 1} transition='opacity 200ms'>
              {t('connection.accept')}
            </Text>
            <Box
              visibility={accepted ? 'visible' : 'hidden'}
              opacity={accepted ? 1 : 0}
              transition='opacity 200ms'
              position='absolute'
              display='flex'
              top={0}
              left={'0'}
              height='100%'
              width='100%'
              alignItems='center'
              justifyContent='center'
              color={'white'}
            >
              <Icon as={LuCheckCircle} boxSize={'1.25rem'} transition='transform 500ms' transform={accepted ? 'scale(1.25)' : 'scale(.8)'} />
            </Box>
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default AuthorizationRequests;

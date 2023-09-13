import { Box, Button, Flex, Icon, Text } from '@chakra-ui/react';
import { useState } from 'react';
import AuthRequest from '../../../../model/auth/AuthRequest';
import AutoAvatar from '../../../common/AutoAvatar';
import GlassContainer from '../../../common/glass/GlassContainer';
import { motion } from 'framer-motion';
import { useDesktopAuthContext } from '../../../../context/DesktopAuthContext';
import { AuthResponseStatus } from '../../../../model/auth/AuthResponse';
import { LuCheckCircle } from 'react-icons/lu';
import FormatUtils from '../../../../utils/FormatUtils';
import { Trans, useTranslation } from 'react-i18next';
import SubmitButton from '../../../common/SubmitButton';

interface AuthorizationRequestItemProps {
  request: AuthRequest;
}
export const AuthorizationRequestItem = ({ request }: AuthorizationRequestItemProps) => {
  const [accepted, setAccepted] = useState(false);
  const { authorizeRequest } = useDesktopAuthContext();

  const handleAccept = () => {
    if (accepted) return;
    setAccepted(true);
    authorizeRequest(request, AuthResponseStatus.AUTHORIZED);
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
        <AuthorizationRequestItemContent
          onAccept={handleAccept}
          onDeny={() => authorizeRequest(request, AuthResponseStatus.DENIED)}
          request={request}
        />
      </GlassContainer>
    </motion.div>
  );
};

interface AuthorizationRequestItemContentProps {
  request: AuthRequest;
  onAccept: () => void;
  onDeny: () => void;
}

export const AuthorizationRequestItemContent = ({ request, onAccept, onDeny }: AuthorizationRequestItemContentProps) => {
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
          <SubmitButton
            onSubmit={handleAccept}
            variant='solid'
            colorScheme='primary'
          >
            {t('connection.accept')}
          </SubmitButton>
        </Flex>
      </Flex>
    </Flex>
  );
};

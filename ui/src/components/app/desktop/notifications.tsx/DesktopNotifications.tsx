import { PropsWithChildren } from 'react';
import AllowedUser from '../../../../model/auth/AllowedUser';
import GlassContainer from '../../../common/glass/GlassContainer';
import AutoAvatar from '../../../common/AutoAvatar';
import { Stack, Text } from '@chakra-ui/react';
import { useDesktopNotificationsContext } from '../../../../context/DesktopNotificationsContext';
import { AnimatePresence, motion } from 'framer-motion';
import QueueActionNotification from '../queue/QueueActionNotification';
import { useTranslation, Trans } from 'react-i18next';
import { useAuthRequestsContext } from '../../../../context/AuthRequestsContext';
import { AuthorizationRequestItem } from '../connection/AuthorizationRequests';

interface Props {
  hideAuthRequests: boolean;
}
const DesktopNotifications = ({ hideAuthRequests }: Props) => {
  const { notifications } = useDesktopNotificationsContext();
  const authRequests = useAuthRequestsContext();
  useTranslation();
  return (
    <Stack position='fixed' bottom='1rem' left='1rem' maxWidth={'50vw'} zIndex={'var(--z-index-toast)'}>
      <AnimatePresence>
        {notifications.userJoined && (
          <AnimationWrapper key={notifications.userJoined.id}>
            <UserJoinedNotificationToast user={notifications.userJoined.data} />
          </AnimationWrapper>
        )}
        {!hideAuthRequests && authRequests.list.map((request) => <AuthorizationRequestItem key={request.userId} request={request} />)}
        {notifications.queue && (
          <AnimationWrapper key={notifications.queue.id}>
            <QueueActionNotification action={notifications.queue.data} />
          </AnimationWrapper>
        )}
      </AnimatePresence>
    </Stack>
  );
};

const AnimationWrapper = ({ children }: PropsWithChildren) => {
  return (
    <motion.div
      style={{ maxHeight: 'fit-content', overflow: 'hidden' }}
      initial={{ scaleY: 0, height: 0 }}
      animate={{ scaleY: 1, height: 'auto' }}
      exit={{ scaleY: 0, height: 0 }}
    >
      {children}
    </motion.div>
  );
};

const UserJoinedNotificationToast = ({ user }: { user: AllowedUser }) => {
  return (
    <GlassContainer
      p={2}
      display='flex'
      bg='bg.300'
      alignItems='center'
      width='fit-content'
      gap={2}
      borderRadius='md'
      boxShadow='md'
      border='1px'
      borderColor='borders.50'
    >
      <AutoAvatar name={user.nickname} size='sm' boxSize='1.5rem' />
      <Text>
        <Trans i18nKey='notifications.joined' values={{ nickname: user.nickname }} components={[<b />]} />
      </Text>
    </GlassContainer>
  );
};
export default DesktopNotifications;

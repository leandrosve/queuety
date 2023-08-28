import React, { PropsWithChildren } from 'react';
import AllowedUser from '../../../../model/auth/AllowedUser';
import GlassContainer from '../../../common/glass/GlassContainer';
import AutoAvatar from '../../../common/AutoAvatar';
import { Box, Stack, Text } from '@chakra-ui/react';
import { useDesktopNotificationsContext } from '../../../../context/DesktopNotificationsContext';
import { AnimatePresence, motion } from 'framer-motion';
import { DesktopNotification } from '../../../../model/notifications/DesktopNotification';
import QueueActionNotification from '../queue/QueueActionNotification';
import { useTranslation, Trans } from 'react-i18next';
const renderNotification = (notification: DesktopNotification) => {
  if (notification.type === 'user-joined') return <UserJoinedNotificationToast user={notification.data} />;
  if (notification.type === 'queue-action') return <QueueActionNotification action={notification.data} />;
};
const DesktopNotifications = () => {
  const notifications = useDesktopNotificationsContext();
  useTranslation();
  return (
    <Stack position='fixed' bottom='1rem' left='1rem' maxWidth={'50vw'} zIndex={'var(--z-index-toast)'}>
      <AnimatePresence>
        {notifications.list.map((i) => (
          <AnimationWrapper key={i.id}>{renderNotification(i)}</AnimationWrapper>
        ))}
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
    <GlassContainer p={2} display='flex' bg='bg.300' alignItems='center' width='fit-content' gap={2} borderRadius='md' boxShadow='md'>
      <AutoAvatar name={user.nickname} size='sm' boxSize='1.5rem' />
      <Text>
        <Trans i18nKey='notifications.joined' values={{ nickname: user.nickname }} components={[<b />]} />
      </Text>
    </GlassContainer>
  );
};
export default DesktopNotifications;

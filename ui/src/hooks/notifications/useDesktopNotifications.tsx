import AllowedUser from '../../model/auth/AllowedUser';
import { Text, useToast } from '@chakra-ui/react';
import GlassContainer from '../../components/common/glass/GlassContainer';
import AutoAvatar from '../../components/common/AutoAvatar';
import { useCallback } from 'react';
import QueueActionNotification from '../../components/app/desktop/queue/QueueActionNotification';
import { QueueAction, QueueActionType } from '../../model/queue/QueueActions';
import { useAllowedUsersContext } from '../../context/AllowedUsersContext';

const useDesktopNotifications = () => {
  const toast = useToast();
  const { get: getAllowedUser } = useAllowedUsersContext();

  const userJoined = useCallback((user: AllowedUser) => {
    toast({
      position: 'bottom-left',
      duration: 3500,
      render: () => (
        <GlassContainer p={2} display='flex' bg='bg.300' alignItems='center' gap={2} borderRadius='md' boxShadow='md'>
          <AutoAvatar name={user.nickname} size='sm' boxSize='1.5rem' />
          <Text>
            <b>{user.nickname}</b> has joined
          </Text>
        </GlassContainer>
      ),
    });
  }, []);

  const queueAction = useCallback((action: QueueAction) => {
    const applicableActions = [QueueActionType.ADD_LAST, QueueActionType.ADD_NEXT, QueueActionType.ADD_NOW];
    if (!applicableActions.includes(action.type)) return;
    // Can't seem to access context inside render function
    const user = getAllowedUser(action.userId);
    if (!user) return;
    toast.close('queue-action-notification');
    setTimeout(() => {
      toast({
        position: 'bottom-left',
        duration: 3500,
        id: 'queue-action-notification',
        render: () => <QueueActionNotification action={action} user={user} />,
      });
    }, 200);
  }, []);

  return {
    userJoined,
    queueAction,
  };
};

export default useDesktopNotifications;

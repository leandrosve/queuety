import React, { PropsWithChildren, useContext, useCallback } from 'react';
import useSimpleList from '../hooks/common/useSimpleList';
import { AddToQueueNotification, DesktopNotification, UserJoinedNotification } from '../model/notifications/DesktopNotification';
import AllowedUser from '../model/auth/AllowedUser';
import { v4 } from 'uuid';
import { QueueAction, QueueActionType } from '../model/queue/QueueActions';

interface DesktopNotificationsContextProps {
  list: DesktopNotification[];
  addUserJoined: (user: AllowedUser) => void;
  addQueueAction: (action: QueueAction) => void;
}

const DesktopNotificationsContext = React.createContext<DesktopNotificationsContextProps>({
  list: [],
  addQueueAction: () => {},
  addUserJoined: () => {},
});

export const DesktopNotificationsProvider = ({ children }: PropsWithChildren) => {
  const notifications = useSimpleList<DesktopNotification>([], (d) => d.id);

  const addUserJoined = useCallback((user: AllowedUser) => {
    const notification: UserJoinedNotification = { id: v4(), type: 'user-joined', data: user };
    notifications.add(notification);
    setTimeout(() => notifications.remove(notification), 3000);
  }, []);

  const addQueueAction = useCallback((action: QueueAction) => {
    const applicableActions = [QueueActionType.ADD_LAST, QueueActionType.ADD_NEXT, QueueActionType.ADD_NOW];
    if (!applicableActions.includes(action.type)) return;
    const notification: AddToQueueNotification = { id: v4(), type: 'queue-action', data: action };
    notifications.add(notification);
    //setTimeout(() => notifications.remove(notification), 5000);
  }, []);

  return (
    <DesktopNotificationsContext.Provider value={{ list: notifications.data, addQueueAction, addUserJoined }}>
      {children}
    </DesktopNotificationsContext.Provider>
  );
};

export const useDesktopNotificationsContext = () => {
  return useContext(DesktopNotificationsContext);
};

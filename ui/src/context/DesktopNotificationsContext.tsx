import React, { PropsWithChildren, useContext, useCallback } from 'react';
import useSimpleList from '../hooks/common/useSimpleList';
import { AddToQueueNotification, DesktopNotification, UserJoinedNotification } from '../model/notifications/DesktopNotification';
import AllowedUser from '../model/auth/AllowedUser';
import { v4 } from 'uuid';
import { QueueAction, QueueActionType } from '../model/queue/QueueActions';
import useVolatileValue from '../hooks/common/useVolatileValue';

interface DesktopNotificationsContextProps {
  list: DesktopNotification[];
  addUserJoined: (user: AllowedUser) => void;
  addQueueAction: (action: QueueAction) => void;
  notifications: {
    queue: AddToQueueNotification | null;
    userJoined: UserJoinedNotification | null;
  };
}

const DesktopNotificationsContext = React.createContext<DesktopNotificationsContextProps>({
  list: [],
  addQueueAction: () => {},
  addUserJoined: () => {},
  notifications: {
    userJoined: null,
    queue: null,
  },
});

export const DesktopNotificationsProvider = ({ children }: PropsWithChildren) => {
  const notifications = useSimpleList<DesktopNotification>([], (d) => d.id);
  const [queue, setQueue] = useVolatileValue<AddToQueueNotification>(null, 4000);
  const [userJoined, setUserJoined] = useVolatileValue<UserJoinedNotification>(null, 4000);

  const addUserJoined = useCallback((user: AllowedUser) => {
    const notification: UserJoinedNotification = { id: v4(), type: 'user-joined', data: user };
    setUserJoined(notification);
  }, []);

  const addQueueAction = useCallback((action: QueueAction) => {
    const applicableActions = [QueueActionType.ADD_LAST, QueueActionType.ADD_NEXT, QueueActionType.ADD_NOW];
    if (!applicableActions.includes(action.type)) return;
    const notification: AddToQueueNotification = { id: v4(), type: 'queue-action', data: action };
    setQueue(notification);
  }, []);

  return (
    <DesktopNotificationsContext.Provider
      value={{
        list: notifications.data,
        addQueueAction,
        addUserJoined,
        notifications: {
          userJoined,
          queue,
        },
      }}
    >
      {children}
    </DesktopNotificationsContext.Provider>
  );
};

export const useDesktopNotificationsContext = () => {
  return useContext(DesktopNotificationsContext);
};

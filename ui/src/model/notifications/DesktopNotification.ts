import AllowedUser from '../auth/AllowedUser';
import { QueueAction } from '../queue/QueueActions';

export type DesktopNotification = AddToQueueNotification | UserJoinedNotification;

export type AddToQueueNotification = {
  id: string;
  type: 'queue-action';
  data: QueueAction;
};

export type UserJoinedNotification = {
  id: string;
  type: 'user-joined';
  data: AllowedUser;
};

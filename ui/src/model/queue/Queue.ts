import QueueItem from '../player/QueueItem';

export interface Queue {
  items: QueueItem[];
  currentId: string | null;
  status: QueueStatus;
  loop: boolean;
}

export enum QueueStatus {
  UNSTARTED = 'unstarted',
  ACTIVE = 'active',
  ENDED = 'ended',
}

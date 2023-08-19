import QueueItem from './QueueItem';

export interface Queue {
  items: QueueItem[];
  currentId: string | null;
  status: QueueStatus;
}

export enum QueueStatus {
  UNSTARTED = 'unstarted',
  ACTIVE = 'active',
  ENDED = 'ended',
}

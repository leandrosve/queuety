import QueueItem from '../player/QueueItem';
import { Queue } from './Queue';

export enum QueueActionType {
  ADD_LAST = 'ADD_LAST',
  ADD_NEXT = 'ADD_NEXT',
  ADD_NOW = 'ADD_NOW',
  REMOVE = 'REMOVE',
  SKIP = 'SKIP_FORWARD',
  SKIP_BACK = 'SKIP_BACK',
  CHANGE_ORDER = 'CHANGE_ORDER',
  PLAY_NOW = 'PLAY_NOW',
  CLEAR = 'CLEAR',
  INITIALIZE = 'INITIALIZE',
}
// An interface for our actions
export type QueueAction = { isLocal?: boolean } & (
  | AddItemAction
  | RemoveItemAction
  | SkipAction
  | SkipBackAction
  | ChangeOrderAction
  | PlayNowAction
  | ClearAction
  | InitializeAction
);
export type QueueActionRequest = QueueAction & { eventId: string; previousEventId?: string; userId?: string | null };
export type AddItemAction = {
  type: QueueActionType.ADD_LAST | QueueActionType.ADD_NEXT | QueueActionType.ADD_NOW;
  payload: QueueItem;
};

export type InitializeAction = {
  type: QueueActionType.INITIALIZE;
  payload: Queue;
};
export type RemoveItemAction = {
  type: QueueActionType.REMOVE;
  payload: string;
};

export type SkipAction = {
  type: QueueActionType.SKIP;
  payload?: null;
};

export type SkipBackAction = {
  type: QueueActionType.SKIP_BACK;
  payload?: null;
};

export type ClearAction = {
  type: QueueActionType.CLEAR;
  payload?: null;
};

export type ChangeOrderAction = {
  type: QueueActionType.CHANGE_ORDER;
  payload: {
    itemId: string;
    destinationIndex: number;
  };
};

export type PlayNowAction = {
  type: QueueActionType.PLAY_NOW;
  payload: {
    itemId: string;
  };
};

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

type BasicActionData = { isLocal?: boolean; timestamp: number; userId: string };
// An interface for our actions
export type QueueAction =
  | AddItemAction
  | RemoveItemAction
  | SkipAction
  | SkipBackAction
  | ChangeOrderAction
  | PlayNowAction
  | ClearAction
  | InitializeAction;

export type QueueActionRequest = QueueAction & { eventId: string; previousEventId?: string };
export type AddItemAction = BasicActionData & {
  type: QueueActionType.ADD_LAST | QueueActionType.ADD_NEXT | QueueActionType.ADD_NOW;
  payload: QueueItem;
};

export type InitializeAction = BasicActionData & {
  type: QueueActionType.INITIALIZE;
  payload: Queue;
};

export type RemoveItemAction = BasicActionData & {
  type: QueueActionType.REMOVE;
  payload: string;
};

export type SkipAction = BasicActionData & {
  type: QueueActionType.SKIP;
  payload?: null;
};

export type SkipBackAction = BasicActionData & {
  type: QueueActionType.SKIP_BACK;
  payload?: null;
};

export type ClearAction = BasicActionData & {
  type: QueueActionType.CLEAR;
  payload?: null;
};

export type ChangeOrderAction = BasicActionData & {
  type: QueueActionType.CHANGE_ORDER;
  payload: {
    itemId: string;
    destinationIndex: number;
  };
};

export type PlayNowAction = BasicActionData & {
  type: QueueActionType.PLAY_NOW;
  payload: {
    itemId: string;
  };
};

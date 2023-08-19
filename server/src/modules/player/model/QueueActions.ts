import QueueItem from './QueueItem';

export enum QueueActionType {
  ADD_LAST = 'ADD_LAST',
  ADD_NEXT = 'ADD_NEXT',
  ADD_NOW = 'ADD_NOW',
  REMOVE = 'REMOVE',
  PLAY_NEXT = 'PLAY_NEXT',
  CHANGE_ORDER = 'CHANGE_ORDER',
  PLAY_NOW = 'PLAY_NOW',
  CLEAR = 'CLEAR',
}

export type QueueAction = AddItemAction | RemoveItemAction | PlayNextAction | ChangeOrderAction | PlayNowAction | ClearAction;
// Same but with an ID that identifies the specific action request
export type QueueActionRequest = QueueAction & { actionId: string };

export type AddItemAction = {
  type: QueueActionType.ADD_LAST | QueueActionType.ADD_NEXT | QueueActionType.ADD_NOW;
  payload: QueueItem;
};

export type RemoveItemAction = {
  type: QueueActionType.REMOVE;
  payload: string;
};

export type PlayNextAction = {
  type: QueueActionType.PLAY_NEXT;
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

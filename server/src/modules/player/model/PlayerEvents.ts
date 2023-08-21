import { Queue } from './Queue';
import QueueItem from './QueueItem';

export enum PlayerEventType {
  ADD_LAST = 'ADD_LAST',
  ADD_NEXT = 'ADD_NEXT',
  ADD_NOW = 'ADD_NOW',
  REMOVE = 'REMOVE',
  PLAY_NEXT = 'PLAY_NEXT',
  CHANGE_ORDER = 'CHANGE_ORDER',
  PLAY_NOW = 'PLAY_NOW',
  CLEAR = 'CLEAR',
  INITIALIZE = 'INITIALIZE',
}

export type PlayerEvent = AddItemEvent | RemoveItemEvent | PlayNextEvent | ChangeOrderEvent | PlayNowEvent | ClearActionEvent | InitializeEvent;
// Same but with an ID that identifies the specific action request
export type PlayerEventRequest = PlayerEvent & { eventId: string };

export type InitializeEvent = {
  type: PlayerEventType.INITIALIZE;
  payload: Queue;
};

export type AddItemEvent = {
  type: PlayerEventType.ADD_LAST | PlayerEventType.ADD_NEXT | PlayerEventType.ADD_NOW;
  payload: QueueItem;
};

export type RemoveItemEvent = {
  type: PlayerEventType.REMOVE;
  payload: string;
};

export type PlayNextEvent = {
  type: PlayerEventType.PLAY_NEXT;
  payload?: null;
};

export type ClearActionEvent = {
  type: PlayerEventType.CLEAR;
  payload?: null;
};

export type ChangeOrderEvent = {
  type: PlayerEventType.CHANGE_ORDER;
  payload: {
    itemId: string;
    destinationIndex: number;
  };
};

export type PlayNowEvent = {
  type: PlayerEventType.PLAY_NOW;
  payload: {
    itemId: string;
  };
};

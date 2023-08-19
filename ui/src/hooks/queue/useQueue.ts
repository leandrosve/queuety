import { Dispatch, useReducer } from 'react';
import QueueItem from '../../model/player/QueueItem';
import { QueueStatus, Queue } from '../../model/queue/Queue';
import Logger from '../../utils/Logger';
import { QueueAction, QueueActionType } from '../../model/queue/QueueActions';

const useQueue = (initialData?: Queue | null, callback?: (action: QueueAction) => void): [Queue, Dispatch<QueueAction>] => {
  const [queue, dispatch] = useReducer((prev: Queue, action: QueueAction) => {
    const next = reducer(prev, action);
    callback?.(action);
    return next;
  }, initialData ?? { items: [], currentId: null, status: QueueStatus.UNSTARTED });
  return [queue, dispatch];
};

const reducer = (queue: Queue, { type, payload }: QueueAction): Queue => {
  switch (type) {
    case QueueActionType.ADD_LAST: {
      return addLast(queue, payload);
    }
    case QueueActionType.ADD_NEXT: {
      return addNext(queue, payload);
    }
    case QueueActionType.ADD_NOW: {
      return addNow(queue, payload);
    }
    case QueueActionType.REMOVE: {
      return remove(queue, payload);
    }
    case QueueActionType.PLAY_NEXT: {
      return playNext(queue);
    }
    case QueueActionType.CHANGE_ORDER: {
      const { itemId, destinationIndex } = payload;
      return changeOrder(queue, itemId, destinationIndex);
    }
    case QueueActionType.PLAY_NOW: {
      return playNow(queue, payload.itemId);
    }
    case QueueActionType.CLEAR: {
      return { ...queue, items: queue.items.filter((i) => i.id === queue.currentId) };
    }
    default:
      return queue;
  }
};

const addLast = (queue: Queue, item: QueueItem): Queue => {
  const nextCurrent = queue.status === QueueStatus.ENDED || queue.items.length === 0 ? item.id : queue.currentId;
  return { ...queue, items: [...queue.items, item], currentId: nextCurrent };
};

const addNow = (queue: Queue, item: QueueItem): Queue => {
  const index = queue.items.findIndex((i) => i.id === queue.currentId);
  const nextItems = [...queue.items];
  nextItems.splice(index + 1, 0, item);
  return { items: nextItems, currentId: item.id, status: QueueStatus.ACTIVE };
};

const addNext = (queue: Queue, item: QueueItem): Queue => {
  const index = queue.items.findIndex((i) => i.id === queue.currentId);
  const nextItems = [...queue.items];
  nextItems.splice(index + 1, 0, item);
  const nextCurrent = queue.status === QueueStatus.ENDED || queue.items.length === 0 ? item.id : queue.currentId;
  return { items: nextItems, currentId: nextCurrent, status: QueueStatus.ACTIVE };
};

const remove = (queue: Queue, itemId: string): Queue => {
  if (queue.currentId === itemId) return queue; // Do not allow to remove current video, for now
  return { ...queue, items: queue.items.filter((i) => i.id !== itemId) };
};

const playNext = (queue: Queue): Queue => {
  const index = queue.items.findIndex((i) => i.id === queue.currentId);
  const nextItem = queue.items[index + 1];
  Logger.info('Current:', queue.currentId, 'Next:', nextItem?.video?.title);
  if (!nextItem) return queue;
  return { ...queue, currentId: nextItem.id };
};

const changeOrder = (queue: Queue, itemId: string, destinationIndex: number): Queue => {
  const startIndex = queue.items.findIndex((i) => i.id === itemId);
  if (startIndex < 0) return queue;
  const result = Array.from(queue.items);
  const [removed] = result.splice(startIndex, 1);
  result.splice(destinationIndex, 0, removed);
  return { ...queue, items: result };
};

const playNow = (queue: Queue, itemId: string): Queue => {
  const index = queue.items.findIndex((i) => i.id === itemId);
  if (index < 0) return queue;
  return { ...queue, currentId: itemId };
};
export default useQueue;

import { useReducer, useCallback } from 'react';
import QueueItem from '../../model/player/QueueItem';
import { QueueStatus, Queue } from '../../model/queue/Queue';
import Logger from '../../utils/Logger';
import { QueueAction, QueueActionType } from '../../model/queue/QueueActions';
import { YoutubeVideoDetail } from '../../services/api/YoutubeService';
import { v4 as uuid } from 'uuid';

export interface QueueControls {
  onAddNow: (video: YoutubeVideoDetail) => void;
  onAddLast: (video: YoutubeVideoDetail) => void;
  onAddNext: (video: YoutubeVideoDetail) => void;
  onClear: () => void;
  onChangeOrder: (itemId: string, destinationIndex: number) => void;
  onRemove: (itemId: string) => void;
  onPlay: (item: QueueItem) => void;
  onSkip: () => void;
  onSkipBack: () => void;
}

const useQueue = (
  initialData?: Queue | null,
  callback?: (action: QueueAction) => void
): { queue: Queue; controls: QueueControls; dispatch: (action: QueueAction, isLocal?: boolean) => void } => {
  const [queue, dispatch] = useReducer((prev: Queue, action: QueueAction) => {
    const next = reducer(prev, action);
    callback?.(action);
    return next;
  }, initialData ?? { items: [], currentId: null, status: QueueStatus.UNSTARTED });

  const dispatchAction = useCallback(
    (action: QueueAction, isLocal = true) => {
      dispatch({ ...action, isLocal });
    },
    [dispatch]
  );

  const onAddNow = useCallback(
    (video: YoutubeVideoDetail) => dispatchAction({ type: QueueActionType.ADD_NOW, payload: { id: uuid(), video } }),
    [dispatchAction]
  );
  const onAddLast = useCallback(
    (video: YoutubeVideoDetail) => dispatchAction({ type: QueueActionType.ADD_LAST, payload: { id: uuid(), video } }),
    [dispatchAction]
  );

  const onSkip = useCallback(() => dispatchAction({ type: QueueActionType.SKIP }), [dispatchAction]);
  const onSkipBack = useCallback(() => dispatchAction({ type: QueueActionType.SKIP_BACK }), [dispatchAction]);

  const onAddNext = useCallback(
    (video: YoutubeVideoDetail) => dispatchAction({ type: QueueActionType.ADD_NEXT, payload: { id: uuid(), video } }),
    [dispatchAction]
  );
  const onClear = useCallback(() => {
    dispatchAction({ type: QueueActionType.CLEAR });
  }, [dispatchAction]);
  const onChangeOrder = useCallback(
    (itemId: string, destinationIndex: number) => dispatchAction({ type: QueueActionType.CHANGE_ORDER, payload: { itemId, destinationIndex } }),
    [dispatchAction]
  );
  const onRemove = useCallback((itemId: string) => dispatchAction({ type: QueueActionType.REMOVE, payload: itemId }), [dispatchAction]);
  const onPlay = useCallback((item: QueueItem) => dispatchAction({ type: QueueActionType.PLAY_NOW, payload: { itemId: item.id } }), [dispatchAction]);

  return {
    queue,
    dispatch: dispatchAction,
    controls: {
      onAddLast,
      onAddNext,
      onAddNow,
      onPlay,
      onRemove,
      onClear,
      onChangeOrder,
      onSkip,
      onSkipBack,
    },
  };
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
    case QueueActionType.SKIP: {
      return skip(queue);
    }
    case QueueActionType.SKIP_BACK: {
      return skipBack(queue);
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
    case QueueActionType.INITIALIZE: {
      return payload;
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

const skip = (queue: Queue): Queue => {
  const index = queue.items.findIndex((i) => i.id === queue.currentId);
  const nextItem = queue.items[index + 1];
  Logger.info('Current:', queue.currentId, 'Next:', nextItem?.video?.title);
  if (!nextItem) return queue;
  return { ...queue, currentId: nextItem.id };
};

const skipBack = (queue: Queue): Queue => {
  const index = queue.items.findIndex((i) => i.id === queue.currentId);
  const previousItem = queue.items[index - 1];
  if (!previousItem) return queue;
  return { ...queue, currentId: previousItem.id };
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

import { useReducer, useCallback } from 'react';
import QueueItem from '../../model/player/QueueItem';
import { QueueStatus, Queue } from '../../model/queue/Queue';
import Logger from '../../utils/Logger';
import { QueueAction, QueueActionRequest, QueueActionType } from '../../model/queue/QueueActions';
import { YoutubePlaylistItem, YoutubeVideoDetail } from '../../services/api/YoutubeService';
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
  onChangeStatus: (status: QueueStatus) => void;
  onToggleLoop: (loop: boolean) => void;
  onPlayPlaylistItem: (item: YoutubePlaylistItem) => void;
}

const emptyQueue: Queue = {
  items: [],
  currentId: null,
  currentPlaylistItem: null,
  status: QueueStatus.UNSTARTED,
  loop: false,
};

const useQueue = (
  userId: string,
  initialData: Queue = emptyQueue,
  callback?: (action: QueueActionRequest) => void
): { queue: Queue; controls: QueueControls; dispatch: (action: QueueActionRequest, isLocal?: boolean) => void } => {
  const [queue, dispatch] = useReducer((prev: Queue, action: QueueActionRequest) => {
    const next = reducer(prev, action);
    callback?.(action);
    return next;
  }, initialData ?? emptyQueue);

  const dispatchAction = useCallback(
    (action: QueueAction, isLocal = true) => {
      dispatch({ ...action, isLocal, eventId: '' });
    },
    [dispatch]
  );

  const basicAction = () => {
    return { userId, timestamp: new Date().getTime() };
  };
  const onAddNow = useCallback(
    (video: YoutubeVideoDetail) => dispatchAction({ type: QueueActionType.ADD_NOW, ...basicAction(), payload: { id: uuid(), video } }),
    [dispatchAction]
  );
  const onAddLast = useCallback(
    (video: YoutubeVideoDetail) => dispatchAction({ type: QueueActionType.ADD_LAST, ...basicAction(), payload: { id: uuid(), video } }),
    [dispatchAction]
  );

  const onSkip = useCallback(() => dispatchAction({ type: QueueActionType.SKIP, ...basicAction() }), [dispatchAction]);
  const onSkipBack = useCallback(() => dispatchAction({ type: QueueActionType.SKIP_BACK, ...basicAction() }), [dispatchAction]);

  const onAddNext = useCallback(
    (video: YoutubeVideoDetail) => dispatchAction({ type: QueueActionType.ADD_NEXT, ...basicAction(), payload: { id: uuid(), video } }),
    [dispatchAction]
  );
  const onClear = useCallback(() => {
    dispatchAction({ type: QueueActionType.CLEAR, ...basicAction() });
  }, [dispatchAction]);
  const onChangeOrder = useCallback(
    (itemId: string, destinationIndex: number) =>
      dispatchAction({ type: QueueActionType.CHANGE_ORDER, ...basicAction(), payload: { itemId, destinationIndex } }),
    [dispatchAction]
  );
  const onRemove = useCallback(
    (itemId: string) => dispatchAction({ type: QueueActionType.REMOVE, ...basicAction(), payload: itemId }),
    [dispatchAction]
  );
  const onPlay = useCallback(
    (item: QueueItem) => dispatchAction({ type: QueueActionType.PLAY_NOW, ...basicAction(), payload: { itemId: item.id } }),
    [dispatchAction]
  );
  const onChangeStatus = useCallback(
    (status: QueueStatus) => dispatchAction({ type: QueueActionType.CHANGE_STATUS, ...basicAction(), payload: { status } }),
    [dispatchAction]
  );
  const onToggleLoop = useCallback(
    (loop: boolean) => dispatchAction({ type: QueueActionType.TOGGLE_LOOP, ...basicAction(), payload: { loop } }),
    [dispatchAction]
  );
  const onPlayPlaylistItem = useCallback(
    (playlistItem: YoutubePlaylistItem) => {
      dispatchAction({ type: QueueActionType.PLAY_PLAYLIST_ITEM, ...basicAction(), payload: { playlistItem } });
    },
    [dispatchAction]
  );
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
      onChangeStatus,
      onToggleLoop,
      onPlayPlaylistItem,
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
    case QueueActionType.CHANGE_STATUS: {
      return { ...queue, status: payload.status };
    }
    case QueueActionType.INITIALIZE: {
      return payload;
    }
    case QueueActionType.TOGGLE_LOOP: {
      return toggleLoop(queue, payload.loop);
    }
    case QueueActionType.PLAY_PLAYLIST_ITEM: {
      console.log('HOLISSS', payload.playlistItem);
      return playPlaylistItem(queue, payload.playlistItem);
    }
    default:
      return queue;
  }
};

const addLast = (queue: Queue, item: QueueItem): Queue => {
  if (contains(queue, item)) return queue;
  const nextCurrent = queue.status === QueueStatus.ENDED || queue.items.length === 0 ? item.id : queue.currentId;
  return { ...queue, items: [...queue.items, item], currentId: nextCurrent };
};

const addNow = (queue: Queue, item: QueueItem): Queue => {
  if (contains(queue, item)) return queue;
  const index = queue.items.findIndex((i) => i.id === queue.currentId);
  const nextItems = [...queue.items];
  nextItems.splice(index + 1, 0, item);
  return { items: nextItems, currentId: item.id, status: QueueStatus.ACTIVE, loop: queue.loop, currentPlaylistItem: queue.currentPlaylistItem };
};

const addNext = (queue: Queue, item: QueueItem): Queue => {
  if (contains(queue, item)) return queue;
  const index = queue.items.findIndex((i) => i.id === queue.currentId);
  const nextItems = [...queue.items];
  nextItems.splice(index + 1, 0, item);
  const nextCurrent = queue.status === QueueStatus.ENDED || queue.items.length === 0 ? item.id : queue.currentId;
  return { items: nextItems, currentId: nextCurrent, status: QueueStatus.ACTIVE, loop: queue.loop, currentPlaylistItem: queue.currentPlaylistItem };
};

const remove = (queue: Queue, itemId: string): Queue => {
  if (queue.currentId === itemId) return queue; // Do not allow to remove current video, for now
  return { ...queue, items: queue.items.filter((i) => i.id !== itemId) };
};

const skip = (queue: Queue): Queue => {
  const index = queue.items.findIndex((i) => i.id === queue.currentId);
  const nextItem = queue.items[index + 1];
  Logger.info('Current:', queue.currentId, 'Next:', nextItem?.video?.title);
  if (!nextItem) {
    if (queue.loop) return { ...queue, currentId: queue.items[0].id };
    return queue;
  }
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

const contains = (queue: Queue, item: QueueItem): boolean => {
  const index = queue.items.findIndex((i) => i.id === item.id);
  return index > 0;
};

const toggleLoop = (queue: Queue, loop: boolean): Queue => {
  const hasFinished = queue.status == QueueStatus.ENDED;
  const currentId = hasFinished ? queue.items[0].id : queue.currentId;
  return { ...queue, loop, currentId };
};

const playPlaylistItem = (queue: Queue, playlistItem: YoutubePlaylistItem): Queue => {
  const currentPlaylist = queue.items.find((i) => i.id === queue.currentId);
  if (playlistItem.playlistId !== currentPlaylist?.video.id) {
    return queue;
  }
  return { ...queue, currentPlaylistItem: playlistItem };
};

export default useQueue;

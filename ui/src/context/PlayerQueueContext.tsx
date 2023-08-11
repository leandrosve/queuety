import React, { useState, PropsWithChildren, useContext, useEffect, useMemo, useCallback } from 'react';
import QueueItem from '../model/player/QueueItem';
import { YoutubeVideoDetail } from '../services/api/YoutubeService';
import { v4 as uuidv4 } from 'uuid';
import Logger from '../utils/Logger';

enum QueueStatus {
  UNSTARTED = 'unstarted',
  ACTIVE = 'active',
  ENDED = 'ended',
}

export type PlayerQueueContextProps = {
  queue: QueueItem[];
  currentItem: QueueItem | null;
  currentIndex: number;
  updateCurrentItem: (value: QueueItem) => void;
  updateQueue: (value: QueueItem[]) => void;
  addLastToQueue: (value: YoutubeVideoDetail) => void;
  addNowToQueue: (value: YoutubeVideoDetail) => void;
  addNextToQueue: (value: YoutubeVideoDetail) => void;
  removeFromQueue: (id: string) => void;
  clearQueue: () => void;
  goNext: () => void;
};

export const PlayerQueueContext = React.createContext<PlayerQueueContextProps>({
  queue: [],
  currentItem: null,
  currentIndex: -1,
  updateCurrentItem: () => {},
  updateQueue: () => {},
  addLastToQueue: () => {},
  addNowToQueue: () => {},
  addNextToQueue: () => {},
  removeFromQueue: () => {},
  clearQueue: () => {},
  goNext: () => {},
});

const getStoredQueue = (): QueueItem[] => {
  const q = localStorage.getItem('queue');
  if (q) return JSON.parse(q) as QueueItem[];
  return [];
};

const getInitialCurrentItem = (): QueueItem | null => {
  const q = localStorage.getItem('queueCurrentItem');
  if (q) return JSON.parse(q) as QueueItem;
  return null;
};

export const PlayerQueueProvider = ({ children }: PropsWithChildren) => {
  const [currentItem, setCurrentItem] = useState<QueueItem | null>(getInitialCurrentItem());
  const [queue, setQueue] = useState<QueueItem[]>(getStoredQueue());
  const [queueStatus, setQueueStatus] = useState<QueueStatus>(QueueStatus.ACTIVE);

  const handleSetCurrentItem = (value: QueueItem) => {
    setCurrentItem(value);
    setQueueStatus(QueueStatus.ACTIVE);
  };

  /* Only to export it, do not use this inside this provider*/
  const currentIndex = useMemo(() => {
    if (!currentItem) return -1;
    return queue.findIndex((i) => i.id == currentItem.id);
  }, [queue, currentItem]);

  const clearQueue = () => {
    setQueue((p) => p.filter((i) => i.id == currentItem?.id));
  };

  const updateQueue = (value: QueueItem[]) => {
    setQueue(value);
  };

  const updateCurrentItem = (value: QueueItem) => {
    const found = queue.find((item) => item.id == value.id);
    if (found) handleSetCurrentItem(found);
  };

  const goNext = () => {
    const index = currentItem ? queue.findIndex((i) => i.id == currentItem.id) : -1;
    const nextItem = queue[index + 1];
    Logger.info('current was', currentItem?.video.title, 'nextItem', nextItem);
    if (nextItem) {
      setCurrentItem(nextItem);
    }
  };

  const addLastToQueue = (video: YoutubeVideoDetail) => {
    const uuid = uuidv4();
    const next = [...queue, { id: uuid, video }];
    setQueue(next);
    const item = next.find((i) => i.id == uuid);
    if (item && queueStatus == QueueStatus.ENDED) {
      handleSetCurrentItem(item);
      return;
    }
  };

  const addNextToQueue = (video: YoutubeVideoDetail) => {
    if (!currentItem) {
      addLastToQueue(video);
      return;
    }
    const pos = queue.findIndex((i) => i.id == currentItem.id);
    let next = [...queue];
    const uuid = uuidv4();
    next.splice(pos + 1, 0, { id: uuid, video });
    next = next.map((i, index) => ({ ...i, order: index }));

    setQueue(next);

    const item = next.find((i) => i.id == uuid);
    if (item && queueStatus == QueueStatus.ENDED) {
      handleSetCurrentItem(item);
      return;
    }

    return item;
  };

  const addNowToQueue = (video: YoutubeVideoDetail) => {
    const item = addNextToQueue(video);
    if (item) handleSetCurrentItem(item);
  };

  const removeFromQueue = (id: string) => {
    setQueue((p) => p.filter((i) => i.id !== id));
  };

  useEffect(() => {
    localStorage.setItem('queue', JSON.stringify(queue));
  }, [queue]);

  useEffect(() => {
    localStorage.setItem('queueCurrentItem', JSON.stringify(currentItem));
  }, [currentItem]);

  return (
    <PlayerQueueContext.Provider
      value={{
        currentItem,
        goNext,
        currentIndex,
        clearQueue,
        updateCurrentItem,
        queue,
        updateQueue,
        addNowToQueue,
        addLastToQueue,
        addNextToQueue,
        removeFromQueue,
      }}
    >
      {children}
    </PlayerQueueContext.Provider>
  );
};

export const usePlayerQueueContext = () => {
  return useContext(PlayerQueueContext);
};

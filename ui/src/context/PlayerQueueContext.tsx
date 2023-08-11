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
  goPrevious: () => void;

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
  goPrevious: () => {},
});

const getInitialQueueInfo = (): QueueInfo => {
  const q = localStorage.getItem('queueInfo');
  if (q) return JSON.parse(q) as QueueInfo;
  return { items: [], current: null, status: QueueStatus.UNSTARTED };
};

interface QueueInfo {
  items: QueueItem[];
  current: QueueItem | null;
  status: QueueStatus;
}

export const PlayerQueueProvider = ({ children }: PropsWithChildren) => {
  const [queueInfo, setQueueInfo] = useState<QueueInfo>(getInitialQueueInfo());
  /* Only to export it, do not use this inside this provider*/
  const currentIndex = useMemo(() => {
    if (!queueInfo.current) return -1;
    return queueInfo.items.findIndex((i) => i.id == queueInfo.current?.id);
  }, [queueInfo]);

  const clearQueue = () => {
    setQueueInfo((p) => ({ ...p, items: p.items.filter((i) => i.id === p.current?.id) }));
  };

  const updateQueue = (value: QueueItem[]) => {
    setQueueInfo((p) => ({ ...p, items: value }));
  };

  const updateCurrentItem = (value: QueueItem) => {
    setQueueInfo((p) => {
      const found = p.items.find((item) => item.id == value.id);
      if (!found) return p;
      return { ...p, current: found };
    });
  };

  const goNext = () => {
    setQueueInfo((p) => {
      const index = p.current ? p.items.findIndex((i) => i.id === p.current?.id) : -1;
      const nextItem = p.items[index + 1];
      Logger.info('Current:', p.current?.video.title, 'Next:', nextItem?.video?.title);
      if (!nextItem) return p;
      return { ...p, current: nextItem };
    });
  };

  const goPrevious = () => {
    setQueueInfo((p) => {
      const index = p.current ? p.items.findIndex((i) => i.id === p.current?.id) : -1;
      if (index < 1) return p;
      const previousItem = p.items[index - 1];
      Logger.info('Current:', p.current?.video.title, 'Previous:', previousItem?.video?.title);
      return { ...p, current: previousItem };
    });
  };

  const addLastToQueue = (video: YoutubeVideoDetail) => {
    setQueueInfo((p) => {
      const newItem = { id: uuidv4(), video };
      const nextItems = [...p.items, newItem];
      const newCurrent = p.status === QueueStatus.ENDED ? newItem : p.current;
      return { items: nextItems, current: newCurrent, status: QueueStatus.ACTIVE };
    });
  };

  const addNextToQueue = (video: YoutubeVideoDetail, playNow?: boolean) => {
    setQueueInfo((p) => {
      const index = p.current ? p.items.findIndex((i) => i.id === p.current?.id) : -1;
      const newItem = { id: uuidv4(), video };
      const nextItems = [...p.items];
      nextItems.splice(index + 1, 0, newItem);
      const newCurrent = playNow || p.status === QueueStatus.ENDED ? newItem : p.current;
      return { items: nextItems, current: newCurrent, status: QueueStatus.ACTIVE };
    });
  };

  const addNowToQueue = (video: YoutubeVideoDetail) => {
    addNextToQueue(video, true);
  };

  const removeFromQueue = (id: string) => {
    setQueueInfo((p) => {
      if (p.current?.id === id) return p;
      return { ...p, items: p.items.filter((i) => i.id !== id) };
    });
  };

  useEffect(() => {
    localStorage.setItem('queueInfo', JSON.stringify(queueInfo));
  }, [queueInfo]);
  return (
    <PlayerQueueContext.Provider
      value={{
        currentItem: queueInfo.current,
        goNext,
        goPrevious,
        currentIndex,
        clearQueue,
        updateCurrentItem,
        queue: queueInfo.items,
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

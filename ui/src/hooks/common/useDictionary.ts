import React, { useEffect, useMemo, useState } from 'react';

export interface Dictionary<T> {
  add: (item: T) => void;
  remove: (item: T) => void;
  clear: () => void;
  data: Record<string, T>;
  list: T[];
}

interface DictionaryOptions {
  localStorageKey?: string;
}

const getInitialData = <T>(accesor: (item: T) => string, initialData?: Record<string, T>, localStorageKey?: string) => {
  if (!localStorageKey) return initialData || {};
  const res = JSON.parse(localStorage.getItem(localStorageKey) || '[]') as T[];
  if (!res?.length) return initialData || {};
  return res.reduce((record, item) => {
    const key = accesor(item);
    record[key] = item;
    return record;
  }, {} as Record<string, T>);
};
const useDictionary = <T>(keyAccessor: (item: T) => string, initialData?: Record<string, T>, options?: DictionaryOptions): Dictionary<T> => {
  const [data, setData] = useState<Record<string, T>>(getInitialData(keyAccessor, initialData, options?.localStorageKey));
  const list = useMemo(() => Object.values(data), [data]);
  const [initialized, setInitialized] = useState<boolean>(false);

  const add = (item: T) => {
    console.log("add", add)
    setData((p) => ({ ...p, [keyAccessor(item)]: item }));
  };

  const remove = (item: T) => {
    setData((p) => {
      const next = { ...p };
      delete next[keyAccessor(item)];
      return next;
    });
  };

  const clear = () => {
    setData({});
  };

  useEffect(() => {
    if (initialized && options?.localStorageKey) {
      localStorage.setItem(options.localStorageKey, JSON.stringify(list));
      return;
    }
    setInitialized(true);
  }, [list]);

  return { data, list, add, remove, clear };
};

export default useDictionary;

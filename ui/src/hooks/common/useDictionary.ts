import { useMemo, useState } from 'react';

export interface Dictionary<T> {
  add: (item: T) => void;
  remove: (item: T) => void;
  clear: () => void;
  data: Record<string, T>;
  list: T[];
}

export const dictionaryDefaults: Dictionary<any> = {
  data: {},
  list: [],
  add: () => {},
  remove: () => {},
  clear: () => {},
};

const useDictionary = <T>(keyAccessor: (item: T) => string, initialData?: Record<string, T>): Dictionary<T> => {
  const [data, setData] = useState<Record<string, T>>(initialData ?? {});
  const list = useMemo(() => Object.values(data), [data]);

  const add = (item: T) => {
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

  return { data, list, add, remove, clear };
};

export default useDictionary;

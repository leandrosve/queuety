import { useMemo, useState, useCallback } from 'react';

export interface SimpleList<T> {
  add: (item: T) => void;
  addUnique: (item: T) => void;
  contains: (item: T) => boolean;
  remove: (item: T) => void;
  clear: () => void;
  data: T[];
}

export const simpleListDefaults: SimpleList<any> = {
  data: [],
  add: () => {},
  remove: () => {},
  clear: () => {},
  addUnique: () => {},
  contains: () => false,
};

const useSimpleList = <T>(initialData?: T[], accessor: (value: T) => any = (v) => v): SimpleList<T> => {
  const [data, setData] = useState<T[]>(initialData ?? []);

  const add = (item: T) => {
    setData((p) => [...p, item]);
  };

  const addUnique = (item: T) => {
    setData((prev) => {
      const index = prev.findIndex((i) => accessor(i) === accessor(item));
      if (index < 0) return [...prev, item];
      return prev.map((i) => (accessor(i) !== accessor(item) ? i : item));
    });
  };

  const remove = (item: T) => {
    setData((p) => p.filter((i) => accessor(i) != accessor(item)));
  };

  const contains = (item: T) => {
    return (
      data.findIndex((i) => {
        return accessor(i) === accessor(item);
      }) >= 0
    );
  };

  const clear = () => {
    setData([]);
  };

  return { data, add, addUnique, remove, contains, clear };
};

export default useSimpleList;

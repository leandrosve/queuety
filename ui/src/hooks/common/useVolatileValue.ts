import { useState, useEffect } from 'react';

/**
 * Similar to useState but for values that should be automatically dismissed after a certain amount of time
 */
const useVolatileValue = <T>(initialValue: T | null, lifespan: number): [value: T | null, setValue: (v: T) => void] => {
  const [value, setValue] = useState<T | null>(initialValue);

  useEffect(() => {
    let timeout: number;
    if (value) {
      timeout = setTimeout(() => setValue(null), lifespan);
    }
    return () => clearTimeout(timeout);
  }, [value, lifespan]);

  return [value, setValue];
};

export default useVolatileValue;

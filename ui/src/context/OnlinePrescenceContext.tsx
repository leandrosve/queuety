import React, { PropsWithChildren, useContext } from 'react';
import useSimpleList, { SimpleList, simpleListDefaults } from '../hooks/common/useSimpleList';

const OnlinePrescenceContext = React.createContext<SimpleList<string>>(simpleListDefaults);

export const OnlinePrescenceProvider = ({ children }: PropsWithChildren) => {
  const onlinePrescence = useSimpleList<string>([]);

  return <OnlinePrescenceContext.Provider value={onlinePrescence}>{children}</OnlinePrescenceContext.Provider>;
};

export const useOnlinePrescenceContext = () => {
  return useContext(OnlinePrescenceContext);
};

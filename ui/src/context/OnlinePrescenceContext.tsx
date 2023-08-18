import React, { PropsWithChildren, useContext } from 'react';
import useSimpleList, { SimpleList, simpleListDefaults } from '../hooks/common/useSimpleList';

const OnlinePrescenceContext = React.createContext<SimpleList<String>>(simpleListDefaults);

export const OnlinePrescenceProvider = ({ children }: PropsWithChildren) => {
  const onlinePrescence = useSimpleList<String>([]);

  return <OnlinePrescenceContext.Provider value={onlinePrescence}>{children}</OnlinePrescenceContext.Provider>;
};

export const useOnlinePrescenceContext = () => {
  return useContext(OnlinePrescenceContext);
};

import React, { PropsWithChildren, useContext } from 'react';
import useSimpleList, { SimpleList, simpleListDefaults } from '../hooks/common/useSimpleList';

const OnlinePrescenceContext = React.createContext<SimpleList<OnlinePrescence>>(simpleListDefaults);
interface OnlinePrescence {
  userId: string;
  clientId: string;
}
export const OnlinePrescenceProvider = ({ children }: PropsWithChildren) => {
  const onlinePrescence = useSimpleList<OnlinePrescence>([], i => i.userId);

  return <OnlinePrescenceContext.Provider value={onlinePrescence}>{children}</OnlinePrescenceContext.Provider>;
};

export const useOnlinePrescenceContext = () => {
  return useContext(OnlinePrescenceContext);
};

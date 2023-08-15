import React, { PropsWithChildren, useContext } from 'react';
import useDictionary, { Dictionary, dictionaryDefaults } from '../hooks/common/useDictionary';
import AuthRequest from '../model/auth/AuthRequest';

interface Props extends Dictionary<AuthRequest> {}

const AuthRequestsContext = React.createContext<Props>(dictionaryDefaults);

export const AuthRequestsProvider = ({ children }: PropsWithChildren) => {
  const authRequests = useDictionary<AuthRequest>((i) => i.userId);

  return <AuthRequestsContext.Provider value={authRequests}>{children}</AuthRequestsContext.Provider>;
};

export const useAuthRequestsContext = () => {
  return useContext(AuthRequestsContext);
};

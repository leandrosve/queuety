import React, { PropsWithChildren, useContext } from 'react';
import useAllowedUsers from '../hooks/connection/useAllowedUsers';
import AllowedUser from '../model/auth/AllowedUser';

interface Props {
  add: (user: AllowedUser) => void;
  remove: (userId: string) => void;
  clear: () => void;
  get: (userId: string) => AllowedUser | null;
  list: AllowedUser[];
}

const AllowedUsersContext = React.createContext<Props>({
  add: () => {},
  remove: () => {},
  clear: () => {},
  get: () => null,
  list: [],
});

export const AllowedUsersProvider = ({ children }: PropsWithChildren) => {
  const allowedUsers = useAllowedUsers();

  return <AllowedUsersContext.Provider value={allowedUsers}>{children}</AllowedUsersContext.Provider>;
};

export const useAllowedUsersContext = () => {
  return useContext(AllowedUsersContext);
};

import React, { useState, useEffect, useMemo } from 'react';
import AuthUser from '../../model/auth/AuthUser';

export interface AuthorizedUser extends AuthUser {
  joinedAt: Date;
}

interface SerializedAuthorizedUser extends AuthUser {
  joinedAt: string;
}

const getSavedUsers = (): Record<string, AuthorizedUser> => {
  const users = JSON.parse(localStorage.getItem('authorized-users') ?? '[]') as SerializedAuthorizedUser[];
  return users.reduce((record, user) => {
    record[user.userId] = { ...user, joinedAt: new Date(user.joinedAt) };
    return record;
  }, {} as Record<string, AuthorizedUser>);
};

const useAuthorizedUsers = () => {
  const [initialized, setInitialized] = useState(false);
  const [users, setUsers] = useState<Record<string, AuthorizedUser>>(getSavedUsers());
  const list = useMemo(() => Object.values(users), [users]);

  const add = (user: AuthorizedUser) => {
    setUsers((prev) => ({ ...prev, [user.userId]: user }));
  };

  const remove = (user: AuthorizedUser) => {
    setUsers((prev) => {
      const next = { ...prev };
      delete next[user.userId];
      return next;
    });
  };

  const clear = () => {
    setUsers({});
  };

  const get = (userId: string) => {
    return users[userId];
  };

  useEffect(() => {
    if (!initialized) {
      setInitialized(true);
      return;
    }
    localStorage.setItem('authorized-users', JSON.stringify(Object.values(users)));
  }, [users]);

  return {
    list,
    add,
    remove,
    clear,
    get,
  };
};

export default useAuthorizedUsers;

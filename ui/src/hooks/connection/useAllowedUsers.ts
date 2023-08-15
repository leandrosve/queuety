import { useState, useEffect } from 'react';
import AllowedUser from '../../model/auth/AllowedUser';

interface SerializedAuthorizedUser extends Omit<AllowedUser, 'joinedAt'> {
  joinedAt: string;
}

const getSavedUsers = (): AllowedUser[] => {
  const users = JSON.parse(localStorage.getItem('authorized-users') ?? '[]') as SerializedAuthorizedUser[];
  return users.map((user) => ({ ...user, joinedAt: new Date(user.joinedAt) }));
};

const useAllowedUsers = () => {
  const [initialized, setInitialized] = useState(false);
  const [list, setList] = useState<AllowedUser[]>(getSavedUsers());

  const add = (user: AllowedUser) => {
    setList((prev) => {
      const index = prev.findIndex((u) => u.userId === user.userId);
      if (index < 0) return [...prev, user];
      return prev.map((i) => (i.userId !== user.userId ? i : user));
    });
  };

  const remove = (user: AllowedUser) => {
    setList((prev) => prev.filter((u) => u.userId !== user.userId));
  };

  const clear = () => {
    setList([]);
  };

  const get = (userId: string) => {
    return list.find((item) => item.userId === userId) ?? null;
  };

  useEffect(() => {
    if (!initialized) {
      setInitialized(true);
      return;
    }
    localStorage.setItem('authorized-users', JSON.stringify(Object.values(list)));
  }, [list]);
  return {
    add,
    remove,
    clear,
    get,
    list,
  };
};

export default useAllowedUsers;

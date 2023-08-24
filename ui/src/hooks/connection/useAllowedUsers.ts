import { useState, useEffect } from 'react';
import AllowedUser from '../../model/auth/AllowedUser';
import StorageUtils, { StorageKey } from '../../utils/StorageUtils';
import DesktopPlayerService from '../../services/api/player/DesktopPlayerService';

interface SerializedAuthorizedUser extends Omit<AllowedUser, 'joinedAt'> {
  joinedAt: string;
}

const getSavedUsers = (): AllowedUser[] => {
  const users = JSON.parse(StorageUtils.get(StorageKey.ALLOWED_USERS) ?? '[]') as SerializedAuthorizedUser[];
  return users.map((user) => ({ ...user, joinedAt: new Date(user.joinedAt) }));
};

const useAllowedUsers = () => {
  const [initialized, setInitialized] = useState(false);
  const [list, setList] = useState<AllowedUser[]>(getSavedUsers());
  const [lastAllowed, setLastAllowed] = useState<AllowedUser | null>();

  const add = (user: AllowedUser) => {
    setList((prev) => {
      const index = prev.findIndex((u) => u.userId === user.userId);
      if (index < 0) return [user, ...prev];
      return prev.map((i) => (i.userId !== user.userId ? i : user));
    });
    setLastAllowed(user);
  };

  const remove = (userId: string) => {
    setList((prev) => {
      const found = prev.find((u) => u.userId === userId);
      if (found) DesktopPlayerService.sendAuthRevocation(found.userId, found.clientId);
      return prev.filter((u) => u.userId !== userId);
    });
  };

  const clear = () => {
    const users = [...list];
    setList([]);
    users.forEach((u) => DesktopPlayerService.sendAuthRevocation(u.userId, u.clientId));
  };

  const get = (userId: string) => {
    return list.find((item) => item.userId === userId) ?? null;
  };

  const update = (user: Partial<AllowedUser>) => {
    return setList((prev) => prev.map((i) => (i.userId !== user.userId ? i : { ...i, ...user })));
  };

  useEffect(() => {
    if (!initialized) {
      setInitialized(true);
      return;
    }
    StorageUtils.set(StorageKey.ALLOWED_USERS, JSON.stringify(Object.values(list)));
  }, [list]);
  return {
    add,
    remove,
    clear,
    get,
    update,
    list,
    lastAllowed,
  };
};

export default useAllowedUsers;

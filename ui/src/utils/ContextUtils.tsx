import React, { ReactNode, PropsWithChildren } from 'react';

export function combineProviders(providers: React.ComponentType<PropsWithChildren>[]): React.FC<{ children: ReactNode }> {
  return ({ children }) => {
    const combined = providers.reduceRight((acc, Provider) => {
      return <Provider>{acc}</Provider>;
    }, children);

    return <>{combined}</>;
  };
}

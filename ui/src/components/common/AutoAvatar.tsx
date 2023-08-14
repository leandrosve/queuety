import { Avatar, AvatarProps } from '@chakra-ui/react';
import React, { useMemo } from 'react';

const COLORS = ['purple', 'red', 'orange', 'yellow', 'green', 'teal', 'blue', 'cyan', 'pink'];

const AutoAvatar = (props: AvatarProps) => {
  const color = useMemo(() => {
    let hash = 0;
    if (!props.name) return 'teal';
    for (var i = 0; i < props.name.length; i++) {
      hash = props.name.charCodeAt(i) + hash;
    }
    const position = hash % 9;
    return COLORS[position];
  }, []);
  return (
    <Avatar
      fontWeight='bold'
      color={`${color}.900`}
      bgGradient={`linear(to-bl, ${color}.200, ${color}.300)`}
      _light={{
        color: `${color}.50`,
        bgGradient: `linear(to-bl, ${color}.400, ${color}.600)`,
      }}
      {...props}
    >
      {props.children}
    </Avatar>
  );
};

export default AutoAvatar;

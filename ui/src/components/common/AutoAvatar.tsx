import { Avatar, AvatarProps } from '@chakra-ui/react';
import { useMemo } from 'react';
import FormatUtils from '../../utils/FormatUtils';

const AutoAvatar = (props: AvatarProps) => {
  const color = useMemo(() => {
    return FormatUtils.getColorForNickname(props.name ?? '');
  }, [props.name]);
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

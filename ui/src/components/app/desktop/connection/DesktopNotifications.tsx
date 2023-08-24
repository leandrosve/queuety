import { Text, useToast } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useAllowedUsersContext } from '../../../../context/AllowedUsersContext';
import AutoAvatar from '../../../common/AutoAvatar';
import GlassContainer from '../../../common/glass/GlassContainer';

const DesktopNotifications = () => {
  const toast = useToast();
  const { lastAllowed } = useAllowedUsersContext();

  useEffect(() => {
    if (!lastAllowed) return;
    setTimeout(() => {
      toast({
        position: 'bottom-left',
        duration: 3500,
        render: () => (
          <GlassContainer p={2} display='flex' bg='bg.300' alignItems='center' gap={2} borderRadius='md' boxShadow='md'>
            <AutoAvatar name={lastAllowed.nickname} size='sm' boxSize='1.5rem' />
            <Text>
              <b>{lastAllowed.nickname}</b> has joined
            </Text>
          </GlassContainer>
        ),
      });
    }, 900);
  }, [lastAllowed]);
  return <></>
};

export default DesktopNotifications;

import GlassContainer from '../../../common/glass/GlassContainer';
import AutoAvatar from '../../../common/AutoAvatar';
import { Flex, Image, Stack, Text } from '@chakra-ui/react';
import { QueueAction, QueueActionType } from '../../../../model/queue/QueueActions';
import AllowedUser from '../../../../model/auth/AllowedUser';
import { YoutubeVideoDetail } from '../../../../services/api/YoutubeService';
import { useMemo } from 'react';

const getVideo = (action: QueueAction) => {
  if (action.type == QueueActionType.ADD_LAST || action.type == QueueActionType.ADD_NEXT || action.type == QueueActionType.ADD_NOW) {
    return action.payload?.video;
  }
  return null;
};

const QueueActionNotification = ({ action, user }: { action: QueueAction; user: AllowedUser }) => {
  const video = useMemo(() => getVideo(action), [action]);
  return (
    <GlassContainer p={2} display='flex' bg='bg.300' alignItems='center' gap={2} borderRadius='md' boxShadow='md' maxWidth='40vw'>
      <Stack>
        <Flex alignItems='center' gap={2}>
          <AutoAvatar name={user.nickname} size='sm' boxSize='1.5rem' />
          <Text>
            <b>{user.nickname}</b> has done something {action.type}
          </Text>
        </Flex>
        {!!video && <ReducedVideoDetail video={video} />}
      </Stack>
    </GlassContainer>
  );
};

const ReducedVideoDetail = ({ video }: { video: YoutubeVideoDetail }) => {
  return (
    <Flex gap={3}>
      <Image src={video.thumbnail} aspectRatio='16/9' width='3rem' objectFit='cover' borderRadius='sm' />
      <Text fontSize='sm'>{video.title}</Text>
    </Flex>
  );
};

export default QueueActionNotification;

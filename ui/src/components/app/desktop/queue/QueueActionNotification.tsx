import GlassContainer from '../../../common/glass/GlassContainer';
import AutoAvatar from '../../../common/AutoAvatar';
import { Flex, Image, Stack, Text } from '@chakra-ui/react';
import { QueueAction, QueueActionType } from '../../../../model/queue/QueueActions';
import { YoutubeVideoDetail } from '../../../../services/api/YoutubeService';
import { useMemo } from 'react';
import { useAllowedUsersContext } from '../../../../context/AllowedUsersContext';
import { Trans, useTranslation } from 'react-i18next';

const getVideo = (action: QueueAction) => {
  if (action.type == QueueActionType.ADD_LAST || action.type == QueueActionType.ADD_NEXT || action.type == QueueActionType.ADD_NOW) {
    return action.payload?.video;
  }
  return null;
};

const QueueActionNotification = ({ action }: { action: QueueAction }) => {
  const allowedUsers = useAllowedUsersContext();
  useTranslation();
  const video = useMemo(() => getVideo(action), [action]);
  const user = useMemo(() => allowedUsers.get(action.userId), [action]);
  if (!user) return null;
  return (
    <GlassContainer p={2} display='flex' bg='bg.300' alignItems='center' gap={2} borderRadius='md' boxShadow='md' maxWidth='40vw'>
      <Stack>
        <Flex alignItems='center' gap={2}>
          <AutoAvatar name={user.nickname} size='sm' boxSize='1.5rem' />
          <Text>
            <Trans i18nKey='notifications.addToQueue' values={{ nickname: user.nickname }} components={[<b />]} />
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
      <Image src={video.thumbnail} aspectRatio='16/9' width='3rem' height='2.75rem' objectFit='cover' borderRadius='sm' />
      <Stack spacing='2px'>
        <Text noOfLines={1} fontSize='sm' fontWeight='bold'>
          {video.title}
        </Text>
        <Flex gap={2}>
          <Image src={video.channelThumbnail} aspectRatio='1/1' height='1rem' width='1rem' objectFit='cover' rounded='full' />
          <Text noOfLines={1} fontSize='xs' color='text.300'>
            {video.channelTitle}
          </Text>
        </Flex>
      </Stack>
    </Flex>
  );
};

export default QueueActionNotification;

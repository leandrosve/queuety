import { Button, Flex, Icon, IconButton, Stack, Text } from '@chakra-ui/react';
import GlassContainer from '../../../common/glass/GlassContainer';
import { MobileQueueItem } from './MobileQueueItem';
import './mobileQueue.css';
import { BsSkipEndFill } from 'react-icons/bs';
import QueueItem from '../../../../model/player/QueueItem';

interface Props {
  queue: QueueItem[];
  currentItem?: QueueItem | null;
  currentIndex: number;
}

const MobileQueue = ({ queue, currentIndex, currentItem }: Props) => {
  return (
    <GlassContainer
      display='flex'
      flexDirection='column'
      flexGrow={1}
      alignSelf='stretch'
      boxShadow='sm'
      marginTop={3}
      padding={0}
      paddingY={2}
      borderTopRadius='xl'
      borderTopWidth='1px'
      borderColor='borders.100'
      position='relative'
      bottom={0}
      left={0}
      minHeight={200}
    >
      <Flex padding={3} gap={2} justifyContent='space-between'>
        <Stack spacing={2}>
          <Flex gap={2}>
            <Text fontSize='sm' noOfLines={2}>
              Playing: {currentItem?.video.title}
            </Text>
          </Flex>

          <Flex gap={3}>
            <Text fontSize='sm' color='text.300'>
              en cola 1/2
            </Text>
            <Button variant='link' size='sm'>
              clear
            </Button>
          </Flex>
        </Stack>
        <IconButton variant='ghost' icon={<Icon as={BsSkipEndFill} boxSize='1.5rem' />} aria-label='play next' />
      </Flex>

      <Stack spacing={1}>
        {queue.map((q, index) => (
          <MobileQueueItem key={q.id} video={q.video} isCurrent={index == 0} onPlay={() => {}} onRemove={() => {}} />
        ))}
      </Stack>
    </GlassContainer>
  );
};

export default MobileQueue;

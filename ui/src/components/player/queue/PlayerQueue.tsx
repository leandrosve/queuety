import { Button, Flex, Input, Text } from '@chakra-ui/react';
import React, { useRef, useState } from 'react';
import YoutubeService from '../../../services/api/YoutubeService';

interface VideoDetails {
  id: string;
  title: string;
  duration: number;
}

const PlayerQueue = () => {
  const [queue, setQueue] = useState<VideoDetails[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const handleAdd = async (id: string) => {
    setQueue((p) => [...p, { id, title: 'Example', duration: 230 }]);
  };

  return (
    <Flex direction='column'>
      <Input placeholder='video url' ref={inputRef} /> <Button onClick={() => handleAdd(inputRef?.current?.value || '')}>ADD</Button>
      {queue.map((video) => (
        <Flex key={video.id}>
          <img src={`https://img.youtube.com/vi/${video.id}/0.jpg`} />
          <Text>{video.title}</Text>
          <Text>{video.duration}</Text>
        </Flex>
      ))}
    </Flex>
  );
};

export default PlayerQueue;

import {
  Button,
  Collapse,
  Flex, Icon,
  IconButton, Input,
  InputGroup,
  InputLeftElement,
  InputRightElement, Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay, ScaleFade,
  Spinner,
  Text
} from '@chakra-ui/react';
import { useRef, useState } from 'react';
import YoutubeAPIService, { YoutubeVideoDetail } from '../../../services/api/YoutubeAPIService';
import { BsSearch, BsX } from 'react-icons/bs';
import PlayerSearchVideoDetail from './PlayerSearchVideoDetail';

const getErrorMessage = (errorCode: string) => {
  if (errorCode === 'video_not_found') return 'Video was not found';
  if (errorCode === 'malformed_url') return 'The provided URL does not correspond to a Youtube Video';
  return 'Something went wrong';
};
interface Props {
  onPlay: (videoId: string) => void;
  onPlayNext: (videoId: string) => void;
  onPlayLast: (videoId: string) => void;
}
const PlayerSearch = ({ onPlay, onPlayNext, onPlayLast }: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [videoDetails, setVideoDetails] = useState<YoutubeVideoDetail | null>(null);
  const [loadingDetails, setLoadingDetails] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [inputFocus, setInputFocus] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = async (url: string) => {
    url = url.trim();
    setInputValue(url);
    if (!url) {
      setError('');
      return;
    }
    var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = url.match(regExp);

    if (!match || match[2].length !== 11) {
      setError('malformed_url');
      return;
    }
    const id = match[2];
    setLoadingDetails(true);
    const res = await YoutubeAPIService.getVideoDetails(id);
    setLoadingDetails(false);
    if (res.hasError) {
      setVideoDetails(null);
      setError(res.error);
      return;
    }
    setError('');
    setVideoDetails(res.data);
  };
  console.count('re render');

  return (
    <>
      <Button display='flex' justifyContent='start' gap={5} onClick={() => setIsOpen(true)}>
        <BsSearch />
        <Text>Pega aquí la URL del video</Text>
      </Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalOverlay />
        <ModalContent width={700} maxWidth='90vw' _dark={{ background: 'bgAlpha.100', backdropFilter: 'blur(3px)' }}>
          <ModalHeader paddingBottom={1}>
            <InputGroup>
              <InputLeftElement pointerEvents='none'>
                <BsSearch />
              </InputLeftElement>
              <Input
                type='text'
                onFocus={() => setInputFocus(true)}
                onBlur={() => setInputFocus(false)}
                ref={inputRef}
                value={inputValue}
                placeholder='Pega aquí la URL del video'
                onChange={(e) => handleInputChange(e.target.value)}
              />
              {!!inputValue && (
                <InputRightElement>
                  <IconButton
                    variant='ghost'
                    size='sm'
                    aria-label='clear'
                    onClick={() => {
                      inputRef.current?.focus();
                      handleInputChange('');
                    }}
                    icon={<Icon as={BsX} boxSize={6} />}
                  />
                </InputRightElement>
              )}
            </InputGroup>
            <Flex marginTop={1} paddingLeft={1}>
              <Text fontWeight='normal' fontSize='sm' opacity={0} width={0} pointerEvents='none' aria-hidden>
                -
              </Text>
              <Collapse in={(inputFocus && !inputValue) || !inputValue || !!error}>
                {((inputFocus && !inputValue) || !inputValue) && (
                  <Text as='span' fontWeight='normal' fontSize='sm'>
                    Por ej: https://www.youtube.com/watch?v=zz5ksvYBfEc
                  </Text>
                )}
                {error && (
                  <Text as='span' color='red.300' _light={{ color: 'red.600' }} fontSize='sm'>
                    {getErrorMessage(error)}
                  </Text>
                )}
              </Collapse>
            </Flex>
          </ModalHeader>

          <ModalBody overflow='hidden' paddingTop={0}>
            {loadingDetails && (
              <Flex justifyContent='center' padding={5}>
                <Spinner />
              </Flex>
            )}

            <ScaleFade initialScale={0.9} in={!loadingDetails && !!videoDetails} unmountOnExit>
              {!!videoDetails && (
                <PlayerSearchVideoDetail
                  onClose={() => setIsOpen(false)}
                  video={videoDetails}
                  onPlay={onPlay}
                  onPlayLast={onPlayLast}
                  onPlayNext={onPlayNext}
                />
              )}
            </ScaleFade>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default PlayerSearch;

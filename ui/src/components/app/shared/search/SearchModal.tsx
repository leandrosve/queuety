import {
  Box,
  Collapse,
  Flex,
  FormControl,
  FormLabel,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  ScaleFade,
  Spinner,
  Switch,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useCallback, useRef, useState } from 'react';
import { BsSearch, BsX } from 'react-icons/bs';
import SearchVideoDetail from './SearchVideoDetail';
import { useTranslation } from 'react-i18next';
import YoutubeService, { YoutubeVideoDetail } from '../../../../services/api/YoutubeService';
import GlassModal from '../../../common/glass/GlassModal';
import { useSettingsContext } from '../../../../context/SettingsContext';

const getErrorCode = (errorCode: string) => {
  if (['video_not_found', 'malformed_url', 'shorts_url'].includes(errorCode)) return errorCode;
  return 'unknown';
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onPlay: (video: YoutubeVideoDetail) => void;
  onPlayNext: (video: YoutubeVideoDetail) => void;
  onPlayLast: (video: YoutubeVideoDetail) => void;
}
const SearchModal = ({ isOpen, onClose, onPlay, onPlayNext, onPlayLast }: Props) => {
  const [videoDetails, setVideoDetails] = useState<YoutubeVideoDetail | null>(null);
  const [loadingDetails, setLoadingDetails] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [inputFocus, setInputFocus] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();

  const toast = useToast();

  const {
    toggleDefaultAddToQueue,
    settings: {
      controls: { defaultAddToQueue },
    },
  } = useSettingsContext();

  const handleInputChange = useCallback(
    async (url: string) => {
      url = url.trim();
      setInputValue(url);
      if (!url) {
        setError('');
        return;
      }
      var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      var match = url.match(regExp);

      if (!match || match[2].length !== 11) {
        if (url.includes('/shorts/')) {
          setError('shorts_url');
          return;
        }
        setError('malformed_url');
        return;
      }
      const id = match[2];
      setLoadingDetails(true);
      const res = await YoutubeService.getVideoDetails(id);
      setLoadingDetails(false);
      if (res.hasError) {
        setVideoDetails(null);
        setError(res.error);
        return;
      }
      setError('');
      const details = res.data;
      setVideoDetails(details);
      if (details && defaultAddToQueue) {
        onPlayLast(details);
        onClose();
        toast({
          title: t('playerSearch.added'),
          status: 'success',
          duration: 2000,
          position: 'top',
          isClosable: true,
        });
        return;
      }
    },
    [defaultAddToQueue, onPlayLast, onClose]
  );

  return (
    <GlassModal contentProps={{ width: 700, maxWidth: '95vw' }} bodyProps={{ padding: 4 }} isOpen={isOpen} onClose={onClose}>
      <Box paddingBottom={1}>
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
            placeholder={t('playerSearch.pasteUrl')}
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
        <Flex marginTop={1} paddingLeft={1} flexWrap='wrap'>
          <Text fontWeight='normal' fontSize='sm' opacity={0} width={0} pointerEvents='none' aria-hidden>
            -
          </Text>
          <Collapse in={(inputFocus && !inputValue) || !inputValue || !!error}>
            {((inputFocus && !inputValue) || !inputValue) && (
              <Text as='span' fontWeight='normal' fontSize={{ base: 'xs', lg: 'sm' }}>
                {t('playerSearch.example')} https://youtu.be/zz5ksvYBfEc
              </Text>
            )}
            {error && (
              <Text as='span' color='red.300' _light={{ color: 'red.600' }} fontSize='sm'>
                {t(`playerSearch.errors.${getErrorCode(error)}`)}
              </Text>
            )}
          </Collapse>

          <FormControl display='inline-flex' alignItems='center' w='auto' marginLeft='auto'>
            <FormLabel htmlFor='playLast' mb='0' fontSize='sm' fontWeight='light'>
              {t('playerSearch.playLast')}
            </FormLabel>
            <Switch id='playLast' size='sm' colorScheme='primary' isChecked={defaultAddToQueue} onChange={() => toggleDefaultAddToQueue()} />
          </FormControl>
        </Flex>
      </Box>

      {loadingDetails && (
        <Flex justifyContent='center' padding={5}>
          <Spinner />
        </Flex>
      )}

      <ScaleFade initialScale={0.9} in={!loadingDetails && !!videoDetails} unmountOnExit>
        {!!videoDetails && (
          <SearchVideoDetail
            onClose={() => {
              onClose();
              setInputValue('');
              setVideoDetails(null);
            }}
            video={videoDetails}
            onPlay={onPlay}
            onPlayLast={onPlayLast}
            onPlayNext={onPlayNext}
          />
        )}
      </ScaleFade>
    </GlassModal>
  );
};

export default SearchModal;

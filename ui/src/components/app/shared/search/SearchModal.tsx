import {
  Box,
  Collapse,
  Flex,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  ScaleFade,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { BsSearch, BsX } from 'react-icons/bs';
import SearchVideoDetail from './SearchVideoDetail';
import { useTranslation } from 'react-i18next';
import YoutubeService, { YoutubePlaylistDetail, YoutubeVideoDetail } from '../../../../services/api/YoutubeService';
import GlassModal from '../../../common/glass/GlassModal';
import SearchPlaylistDetail from './SearchPlaylistDetail';
import URLUtils from '../../../../utils/URLUtils';

const getErrorCode = (errorCode: string) => {
  if (['video_not_found', 'malformed_url', 'shorts_url', 'mix_url'].includes(errorCode)) return errorCode;
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

  const handleInputChange = async (url: string) => {
    url = url.trim();
    setInputValue(url);
    if (!url) {
      setError('');
      return;
    }
    const { playlistId, videoId, error } = URLUtils.getVideoAndPlaylistId(url);
    if (playlistId) {
      getPlaylistDetails(playlistId);
      return;
    }
    if (videoId) {
      getVideoDetails(videoId);
    }
    if (error) {
      setError(error);
    }
  };

  const getVideoDetails = async (id: string) => {
    setLoadingDetails(true);
    const res = await YoutubeService.getVideoDetails(id);
    setLoadingDetails(false);
    if (res.hasError) {
      setVideoDetails(null);
      setError(res.error);
      return;
    }
    setError('');
    setVideoDetails(res.data);
  };

  const getPlaylistDetails = async (playlistId: string) => {
    setLoadingDetails(true);
    const res = await YoutubeService.getPlaylistDetails(playlistId);
    setLoadingDetails(false);
    if (res.hasError) {
      setVideoDetails(null);
      setError(res.error);
      return;
    }
    setError('');
    setVideoDetails(res.data);
  };

  const { t } = useTranslation();

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
        <Flex marginTop={1} paddingLeft={1}>
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
        </Flex>
      </Box>

      {loadingDetails && (
        <Flex justifyContent='center' padding={5}>
          <Spinner />
        </Flex>
      )}

      <ScaleFade initialScale={0.9} in={!loadingDetails && (!!videoDetails)} unmountOnExit>
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

import {
  Box,
  Button,
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
import PlayerSearchVideoDetail from './PlayerSearchVideoDetail';
import { useTranslation } from 'react-i18next';
import YoutubeService, { YoutubeVideoDetail } from '../../../../../services/api/YoutubeService';
import GlassModal from '../../../../common/glass/GlassModal';

const getErrorCode = (errorCode: string) => {
  if (['video_not_found', 'malformed_url', 'shorts_url'].includes(errorCode)) return errorCode;
  return 'unknown';
};

interface Props {
  onPlay: (video: YoutubeVideoDetail) => void;
  onPlayNext: (video: YoutubeVideoDetail) => void;
  onPlayLast: (video: YoutubeVideoDetail) => void;
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
    setVideoDetails(res.data);
  };

  const { t } = useTranslation();

  return (
    <>
      <Button display='flex' justifyContent='start' gap={5} onClick={() => setIsOpen(true)}>
        <BsSearch />
        <Text>{t('playerSearch.pasteUrl')}</Text>
      </Button>
      <GlassModal contentProps={{ width: 700, maxWidth: '90vw' }} bodyProps={{ padding: 4 }} isOpen={isOpen} onClose={() => setIsOpen(false)}>
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
                <Text as='span' fontWeight='normal' fontSize='sm'>
                  {t('playerSearch.example')} https://www.youtube.com/watch?v=zz5ksvYBfEc
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

        <ScaleFade initialScale={0.9} in={!loadingDetails && !!videoDetails} unmountOnExit>
          {!!videoDetails && (
            <PlayerSearchVideoDetail
              onClose={() => {
                setIsOpen(false);
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
    </>
  );
};

export default PlayerSearch;

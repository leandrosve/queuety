import { Box, Button, Flex, IconButton, Spinner } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import ConnectionService from '../../services/api/ConnectionService';
import CopyToClipboard from '../common/CopyToClipboard';
import { LuRefreshCcw } from 'react-icons/lu';

const ConnectionHostView = () => {
  const [code, setCode] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  const onCopy = () => {};

  const retrieveCode = async (forceRegenerate?: boolean) => {
    if (!forceRegenerate) {
      const localCode = ConnectionService.getLocalCode();
      if (localCode) {
        setCode(localCode);
        setLoading(false);
        return;
      }
    }
    setLoading(true);
    const res = await ConnectionService.getConnectionCode();
    if (res.hasError) {
      setLoading(false);

      return;
    }
    setCode(res.data.code);
    ConnectionService.saveLocalCode(res.data.code);
    setLoading(false);
  };
  useEffect(() => {
    retrieveCode();
  }, []);

  return (
    <Box>
      {loading ? (
        <Spinner />
      ) : (
        <Flex direction='column' alignItems='center' gap={3} justifyContent='center'>
          <QRCode size={256} value={code} viewBox={`0 0 256 256`} level='L' bgColor='#f7f5fe' />
          <Flex justifyContent='space-between' alignSelf='stretch'>
            <IconButton aria-label='redo' icon={<LuRefreshCcw />} onClick={() => retrieveCode(true)}>
              Regen
            </IconButton>
            <CopyToClipboard value={code} />
          </Flex>
        </Flex>
      )}
    </Box>
  );
};

export default ConnectionHostView;

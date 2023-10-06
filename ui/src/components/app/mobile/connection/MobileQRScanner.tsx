import { useState } from 'react';
import { QrScanner } from '@yudiel/react-qr-scanner';
import { Alert, AlertIcon } from '@chakra-ui/react';
import GlassModal from '../../../common/glass/GlassModal';
import { useTranslation } from 'react-i18next';
import AuthUtils from '../../../../utils/AuthUtils';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onDecode: (v: string) => void;
}

const MobileQRScanner = ({ isOpen, onClose, onDecode }: Props) => {
  const { t } = useTranslation();
  return (
    <GlassModal isOpen={isOpen} onClose={onClose} title={t('qrScanner.title')} hasCloseButton isCentered>
      <MobileQRScannerContent onDecode={onDecode} />
    </GlassModal>
  );
};

const MobileQRScannerContent = ({ onDecode }: { onDecode: (v: string) => void }) => {
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const { t } = useTranslation();
  const onError = (e?: { message: string }) => {
    if (e?.message == 'The object can not be found here.') {
      setError('camera_missing');
      return;
    }
    setError('default');
  };

  const handleDecode = (result: string) => {
    setWarning(null);
    let code = result ?? '';
    if (!code.startsWith('auth_')) {
      code = result.split('?auth=')[1] ?? '';
    }
    if (!AuthUtils.isValidAuthRoom(code)) {
      setWarning('invalid_url');
      return;
    }
    onDecode(code);
  };
  return (
    <>
      {warning && (
        <Alert borderRadius='lg' status='error' mb={3}>
          <AlertIcon />
          {t(`qrScanner.errors.${warning}`)}
        </Alert>
      )}
      {error ? (
        <Alert borderRadius='lg' status='error'>
          <AlertIcon />
          {t(`qrScanner.errors.${error}`)}
        </Alert>
      ) : (
        <QrScanner constraints={{ facingMode: 'environment' }} onDecode={handleDecode} onError={onError} />
      )}
    </>
  );
};

export default MobileQRScanner;

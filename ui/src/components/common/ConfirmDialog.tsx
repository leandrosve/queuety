import { ReactNode } from 'react';
import GlassModal from './glass/GlassModal';
import { Button, Flex } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

interface Props {
  title: string | ReactNode;
  description: string | ReactNode;
  confirmText?: string;
  cancelText?: string;
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: (() => void) | (() => Promise<void>);
}

const ConfirmDialog = (props: Props) => {
  const { t } = useTranslation();
  return (
    <GlassModal
      isOpen={props.isOpen}
      onClose={props.onCancel}
      title={props.title}
      isCentered
      footer={
        <Flex width='100%' justifyContent='space-between' alignItems='center' alignSelf='stretch' wrap='wrap' gap={1}>
          <Button onClick={props.onCancel}>{props.confirmText ?? t('common.cancel')}</Button>
          <Button onClick={props.onConfirm}>{props.confirmText ?? t('common.accept')}</Button>
        </Flex>
      }
    >
      {props.description}
    </GlassModal>
  );
};

export default ConfirmDialog;

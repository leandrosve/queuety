import { Button, ButtonProps, Flex, IconButton, Tooltip } from '@chakra-ui/react';
import { TbClipboard, TbClipboardCheck } from 'react-icons/tb';
import React, { useState, useEffect, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
interface Props extends ButtonProps {
  value: string;
  tooltip?: string;
  copiedTooltip?: string;
  icon?: ReactNode;
}
const CopyToClipboard = ({ value, tooltip, copiedTooltip, icon, children, ...props }: Props) => {
  const [showCopiedTooltip, setShowCopiedTooltip] = useState(false);
  const { t } = useTranslation();
  useEffect(() => {
    const id = setTimeout(() => {
      setShowCopiedTooltip(false);
    }, 2000);
    return () => clearTimeout(id);
  }, [showCopiedTooltip]);

  return (
    <Tooltip
      label={showCopiedTooltip ? copiedTooltip || t('common.copied') : tooltip || t('common.copy')}
      placement='right'
      isOpen={showCopiedTooltip ? true : undefined}
      hasArrow
    >
      <Button
        onClick={() => {
          navigator.clipboard.writeText(value);
          setShowCopiedTooltip(true);
        }}
        aria-label={'Copiar código de acceso'}
        {...props}
      >
        <Flex gap={2} alignItems='center'>
          {icon ?? (showCopiedTooltip ? <TbClipboardCheck /> : <TbClipboard />)}
          {children}
        </Flex>
      </Button>
    </Tooltip>
  );
};

export default CopyToClipboard;

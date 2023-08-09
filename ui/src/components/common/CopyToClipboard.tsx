import { IconButton, Tooltip } from '@chakra-ui/react';
import { TbClipboard, TbClipboardCheck } from 'react-icons/tb';
import React, { useState, useEffect } from 'react';

interface Props {
  value: string;
  tooltip?: string;
  copiedTooltip?: string;
}
const CopyToClipboard = ({ value, tooltip, copiedTooltip }: Props) => {
  const [showCopiedTooltip, setShowCopiedTooltip] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => {
      setShowCopiedTooltip(false);
    }, 2000);
    return () => clearTimeout(id);
  }, [showCopiedTooltip]);

  return (
    <Tooltip
      label={showCopiedTooltip ? copiedTooltip || 'Código copiado!' : tooltip || 'Copiar'}
      placement={showCopiedTooltip ? 'right' : 'bottom'}
      isOpen={showCopiedTooltip ? true : undefined}
      hasArrow
    >
      <IconButton
        onClick={() => {
          navigator.clipboard.writeText(value);
          setShowCopiedTooltip(true);
        }}
        icon={showCopiedTooltip ? <TbClipboardCheck /> : <TbClipboard />}
        aria-label={'Copiar código de acceso'}
      />
    </Tooltip>
  );
};

export default CopyToClipboard;

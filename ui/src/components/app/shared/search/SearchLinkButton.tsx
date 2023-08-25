import { Button, ButtonProps, Text } from '@chakra-ui/react';
import { MouseEventHandler } from 'react';
import { useTranslation } from 'react-i18next';
import { BsSearch } from 'react-icons/bs';

interface Props extends ButtonProps {
  onClick: () => void;
}

const SearchLinkButton = ({ onClick, ...buttonProps }: Props) => {
  const { t } = useTranslation();
  const onContextMenu: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    onClick?.();
  };
  return (
    <Button display='flex' flexShrink={0} onContextMenu={onContextMenu} justifyContent='start' gap={5} onClick={onClick} {...buttonProps}>
      <BsSearch />
      <Text>{t('playerSearch.pasteUrl')}</Text>
    </Button>
  );
};

export default SearchLinkButton;

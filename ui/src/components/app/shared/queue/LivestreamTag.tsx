import { Tag } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

const LivestreamTag = () => {
  const { t } = useTranslation();
  return (
    <Tag
      as='span'
      colorScheme='red'
      variant='solid'
      color='white'
      fontWeight='bold'
      fontSize='xs'
      textTransform='uppercase'
      position='absolute'
      borderRadius='sm'
      bottom='.2rem'
      right='.2rem'
      padding={1}
      paddingY={0}
      minHeight='auto'
    >
      {t('common.live')}
    </Tag>
  );
};

export default LivestreamTag;

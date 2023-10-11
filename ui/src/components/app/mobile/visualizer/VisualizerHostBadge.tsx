import { Flex, FlexProps, Text } from '@chakra-ui/react';
import { useMemo } from 'react';
import { PiScreencastFill } from 'react-icons/pi';
import HostData from '../../../../model/auth/HostData';
import FormatUtils from '../../../../utils/FormatUtils';
import { useTranslation } from 'react-i18next';

interface Props extends FlexProps {
  host: HostData;
  color?: string;
  hasShadow?: boolean;
}
const VisualizerHostBadge = ({ host, color, hasShadow, ...props }: Props) => {
  const hostColor = useMemo(() => FormatUtils.getColorForNickname(host.nickname), [host]);
  const { t } = useTranslation();
  return (
    <Flex
      direction='column'
      position='absolute'
      bottom={0}
      fontSize='xs'
      justifyContent='center'
      alignItems='center'
      padding={2}
      width='100%'
      textShadow={hasShadow ? '0px 1px 3px grey' : 'none'}
      bgGradient='linear(to-t, blackAlpha.700, transparent)'
      color={color}
      {...props}
    >
      <Flex alignItems='center' gap={2}>
        <Text>{t('player.playingInDesktop')}</Text>
      </Flex>
      <Flex alignItems='center' color='white' backgroundColor={`${hostColor}.500`} borderRadius='md' paddingX={2} gap={1}>
        <PiScreencastFill />
        <Text as='span'>{host.nickname}</Text>
      </Flex>
    </Flex>
  );
};

export default VisualizerHostBadge;

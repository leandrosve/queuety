import { Button, Flex, Icon, Text } from '@chakra-ui/react';
import BrandIcon from '../../../../assets/images/BrandIcon';
import useLayoutBackdrop from '../../../../hooks/layout/useLayoutBackdrop';
import { LayoutBackdropPicture } from '../../../../context/LayoutContext';
import AuthUtils from '../../../../utils/AuthUtils';
import { useTranslation } from 'react-i18next';

const RoomSwitchWarning = () => {
  const { t } = useTranslation();
  useLayoutBackdrop(true, LayoutBackdropPicture.DEVICE_SELECTION);
  const handleFinish = () => {
    AuthUtils.endSession();
  };

  const handleContinue = () => {
    AuthUtils.clearUrl();
    location.reload();
  };

  return (
    <Flex flex={1} margin='auto'>
      <Flex flex={1} direction='column' justifyContent='center' alignItems='center' maxWidth={700} padding={4}>
        <Icon as={BrandIcon} boxSize={8} marginBottom={5} alignSelf='start' />
        <Text>{t('roomSwitch.description')}</Text>
        <Flex
          gap={3}
          alignSelf='stretch'
          justifyContent='stretch'
          wrap='wrap'
          marginTop={5}
          direction={{ base: 'column', lg: 'row' }}
          alignItems='stretch'
        >
          <Button onClick={handleContinue}>{t('roomSwitch.skip')}</Button>
          <Button onClick={handleFinish}>{t('roomSwitch.accept')}</Button>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default RoomSwitchWarning;

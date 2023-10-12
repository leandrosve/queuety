import { Button, Divider, Flex, Heading, Icon, Text } from '@chakra-ui/react';
import StorageUtils, { StorageKey } from '../../../../utils/StorageUtils';
import useLayoutBackdrop from '../../../../hooks/layout/useLayoutBackdrop';
import NavbarMobile from '../../mobile/layout/NavbarMobile';
import SettingsModal from '../settings/SettingsModal';
import { useState } from 'react';
import { LayoutBackdropPicture } from '../../../../context/LayoutContext';
import BrandIcon from '../../../../assets/images/BrandIcon';
import { LuMonitorPlay, LuSmartphoneNfc } from 'react-icons/lu';
import { isMobile as isMobileBrowser } from 'react-device-detect';
import ConfirmDialog from '../../../common/ConfirmDialog';
import { Trans, useTranslation } from 'react-i18next';
import ContactModal from '../contact/ContactModal';
export enum DeviceType {
  MOBILE = 'MOBILE',
  DESKTOP = 'DESKTOP',
}

interface Props {
  onSelected: (type: DeviceType) => void;
}

const DeviceSelection = ({ onSelected }: Props) => {
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isContactModalOpen, setContactModalOpen] = useState(false);

  const [confirmDialog, setConfirmDialog] = useState<DeviceType | null>(null);
  const { t } = useTranslation(undefined, { keyPrefix: 'deviceSelection' });
  useLayoutBackdrop(true, LayoutBackdropPicture.DEVICE_SELECTION);

  const handleSelect = (type: DeviceType) => {
    if ((type === DeviceType.DESKTOP && isMobileBrowser) || (type === DeviceType.MOBILE && !isMobileBrowser)) {
      setConfirmDialog(type);
      return;
    }
    handleSelectConfirmation(type);
  };

  const handleSelectConfirmation = (type: DeviceType) => {
    StorageUtils.set(StorageKey.DEVICE, type);
    onSelected(type);
  };

  return (
    <>
      <NavbarMobile onOpenSettingsModal={() => setIsSettingsModalOpen(true)} />
      <SettingsModal
        onOpenContact={() => setContactModalOpen(true)}
        deviceType={null}
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />
      <ContactModal isOpen={isContactModalOpen} onClose={() => setContactModalOpen(false)} />
      <Flex padding={{ base: 5, md: '5rem' }} gap={3} justifyContent='center'>
        <Flex
          className='section-fade-in'
          maxWidth={1100}
          minWidth={'50vw'}
          direction='column'
          gap={3}
          height='auto'
          marginBottom={5}
          grow={1}
          alignItems='start'
          flex='1 1 0'
          position='relative'
          shrink={0}
        >
          <Flex alignItems='center' gap={3}>
            <Icon as={BrandIcon} boxSize='2.5rem' _dark={{ filter: 'drop-shadow(1px 1px 15px var(--text-300))' }} />
            <Heading size='lg' _dark={{ textShadow: '1px 1px 15px var(--text-300)' }}>
              Queuety
            </Heading>
          </Flex>
          <Text fontWeight='bold' fontSize='lg'>
            {t('title')}
          </Text>
          <Divider marginY={2} />

          <Text fontSize='lg'>
            <Trans i18nKey={'deviceSelection.description'} components={[<b></b>]} />
          </Text>
          <Text fontSize='lg' fontWeight='bold'>
            {t('selectPrompt')}
          </Text>
          <Flex direction={isMobileBrowser ? 'column-reverse' : 'column'} gap={3} alignItems='start' position='relative'>
            <Button
              border='1px'
              borderColor='borders.100'
              maxWidth='100%'
              width='100%'
              size='lg'
              justifyContent='start'
              height='auto'
              textAlign='start'
              padding={{ base: 5, md: '3rem' }}
              whiteSpace='normal'
              onClick={() => handleSelect(DeviceType.DESKTOP)}
            >
              <Flex direction='column' textAlign='start' gap={3}>
                <Flex alignItems='center' gap={3} fontSize='1.5rem'>
                  <LuMonitorPlay />
                  {t('receptor.title')}
                </Flex>
                <Text fontSize='lg' fontWeight='normal'>
                  {t('receptor.description')}
                </Text>
              </Flex>
            </Button>
            <Button
              border='1px'
              borderColor='borders.100'
              maxWidth='100%'
              width='100%'
              size='lg'
              height='auto'
              textAlign='start'
              padding={{ base: 5, md: '3rem' }}
              whiteSpace='normal'
              justifyContent='start'
              onClick={() => handleSelect(DeviceType.MOBILE)}
            >
              <Flex direction='column' textAlign='start' gap={3}>
                <Flex alignItems='center' gap={3} fontSize='1.5rem'>
                  <LuSmartphoneNfc />
                  {t('emitter.title')}
                </Flex>
                <Text fontSize='lg' fontWeight='normal'>
                  {t('emitter.description')}
                </Text>
              </Flex>
            </Button>
          </Flex>
        </Flex>
        <ConfirmDialog
          isOpen={!!confirmDialog}
          onCancel={() => setConfirmDialog(null)}
          onConfirm={() => {
            if (confirmDialog) handleSelectConfirmation(confirmDialog);
          }}
          title={t(confirmDialog == DeviceType.MOBILE ? 'emitter.confirmation.title' : 'receptor.confirmation.title')}
          description={
            <Trans
              i18nKey={
                confirmDialog == DeviceType.MOBILE
                  ? 'deviceSelection.emitter.confirmation.description'
                  : 'deviceSelection.receptor.confirmation.description'
              }
              components={[<b></b>, <b></b>]}
            />
          }
        />
      </Flex>
    </>
  );
};

export default DeviceSelection;

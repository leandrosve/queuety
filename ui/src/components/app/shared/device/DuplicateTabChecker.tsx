import { Box, Button, Flex, Icon, Text } from '@chakra-ui/react';
import { useEffect, useState, PropsWithChildren, ReactNode } from 'react';
import PlayerBackdrop from '../../desktop/player/PlayerBackdrop';
import backdrop from '../../../../assets/images/background.jpg';
import { v1 } from 'uuid';
import { LuArrowBigRight } from 'react-icons/lu';
import { Trans, useTranslation } from 'react-i18next';
import NavbarMobile from '../../mobile/layout/NavbarMobile';
import BrandIcon from '../../../../assets/images/BrandIcon';

const OMMIT = false;
const channel = new BroadcastChannel('tab');

const DuplicateTabChecker = ({ children }: PropsWithChildren):ReactNode => {
  const [showError, setShowError] = useState(false);
  const [tabId] = useState('tab_' + v1());
  useTranslation();
  useEffect(() => {
    if (OMMIT || showError) return;
    channel.postMessage({ type: 'check-unique-tab', tabId });
    // note that listener is added after posting the message
    channel.addEventListener('message', (msg) => {
      if (msg.data?.type === 'check-unique-tab' && msg.data?.tabId !== tabId) {
        // message received from other tab
        setShowError(true);
      }
    });
  }, []);

  const continueFromThisTab = () => {
    channel.postMessage({ type: 'check-unique-tab', tabId });
    setShowError(false);
  };

  if (showError)
    return (
      <Flex grow={1} alignItems='stretch' justifyContent='space-between' direction='column' zIndex={1} flex='1 1 0' minHeight={0}>
        <NavbarMobile onOpenSettingsModal={() => {}} />

        <Flex alignItems='center' justifyContent='center' direction='column' padding={4} marginTop='-5rem'>
          <Flex direction='column' gap={4}>
            <Icon as={BrandIcon} boxSize='3rem' />
            <Text>
              <Trans i18nKey={'tabChecker.error'} components={[<br />]} />
            </Text>
            <Button onClick={continueFromThisTab} leftIcon={<LuArrowBigRight />}>
              <Trans i18nKey={'tabChecker.button'} />
            </Button>
            <Box opacity={0.3} zIndex={-1}>
              <PlayerBackdrop image={backdrop} state={1} />
            </Box>
          </Flex>
        </Flex>
        <div />
      </Flex>
    );
  return children;
};

export default DuplicateTabChecker;

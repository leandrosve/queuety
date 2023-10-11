import { useState } from 'react';
import GlassModal from '../../../common/glass/GlassModal';
import { Alert, AlertIcon, Box, Button, Flex, FormControl, FormErrorMessage, FormLabel, Icon, Input, Text, Textarea } from '@chakra-ui/react';
import { LuSendHorizonal } from 'react-icons/lu';
import Form from '../../../common/Form';
import { BiMessageRoundedCheck } from 'react-icons/bi';
import { useTranslation } from 'react-i18next';
import EmailService from '../../../../services/EmailService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const isValidEmail = (email: string) => {
  return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
};

const ContactModal = ({ isOpen, onClose }: Props) => {
  const { t } = useTranslation();
  return (
    <GlassModal isOpen={isOpen} onClose={onClose} width='500px' maxWidth={'95vw'} hasCloseButton title={t('contact.title')}>
      <Content onClose={onClose} />
    </GlassModal>
  );
};

const MESSAGE_MAX_LENGTH = 500;
const Content = ({ onClose }: { onClose: () => void }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ email: '', message: '', sent: '' });
  const [messageSent, setMessageSent] = useState(false);
  const { t } = useTranslation();

  const updateEmail = (e: string) => {
    setErrors((p) => ({ ...p, email: '' }));
    setEmail(e.toLowerCase());
  };

  const updateMessage = (e: string) => {
    setMessage(e);
    setErrors((p) => ({ ...p, message: '' }));
  };

  const validateEmail = () => {
    if (!isValidEmail(email)) {
      setErrors((p) => ({ ...p, email: 'invalid_email' }));
      return true;
    }
    setErrors((p) => ({ ...p, email: '' }));
    return false;
  };

  const validateMessage = () => {
    if (!message) {
      setErrors((p) => ({ ...p, message: 'empty_message' }));
      return true;
    }
    if (message.length > MESSAGE_MAX_LENGTH) {
      setErrors((p) => ({ ...p, message: 'message_too_long' }));
      return true;
    }
    setErrors((p) => ({ ...p, message: '' }));
    return false;
  };

  const onSubmit = async () => {
    setErrors((p) => ({ ...p, sent: '' }));
    const m = validateMessage();
    const e = validateEmail();
    if (m || e) return;
    setIsLoading(true);
    try {
      await EmailService.sendEmail(email, message);
      setMessageSent(true);
    } catch {
      setErrors((p) => ({ ...p, sent: 'not_sent' }));
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Box position='relative'>
      <Form
        onSubmit={onSubmit}
        display='flex'
        flexDirection='column'
        gap={1}
        transition='opacity 300ms'
        opacity={messageSent ? 0 : 1}
        pointerEvents={messageSent ? 'none' : 'all'}
      >
        <Text mb={2}>{t('contact.description')}</Text>
        {errors.sent && (
          <Alert status='error' mb={2} borderRadius='lg'>
            <AlertIcon />
            {t(`contact.errors.${errors.sent}`)}
          </Alert>
        )}
        <FormControl isInvalid={!!errors.email}>
          <FormLabel mb={0}>{t('contact.email.label')}</FormLabel>
          <Input
            placeholder={t('contact.email.placeholder')}
            value={email}
            onChange={(e) => updateEmail(e.target.value)}
            onBlur={() => validateEmail()}
          />
          <FormErrorMessage>{t(`contact.errors.${errors.email}`)}</FormErrorMessage>
        </FormControl>
        <FormControl mt={3} isInvalid={!!errors.message}>
          <FormLabel mb={0}>{t('contact.message.label')}</FormLabel>
          <Textarea
            height='8rem'
            resize='none'
            value={message}
            onBlur={() => validateMessage()}
            onChange={(e) => updateMessage(e.target.value)}
            placeholder={t('contact.message.placeholder')}
          />
          <Flex justifyContent='space-between' alignItems='center'>
            <FormErrorMessage>{t(`contact.errors.${errors.message}`)}</FormErrorMessage>
            <Text
              marginLeft='auto'
              fontSize='sm'
              _light={{ color: message.length > MESSAGE_MAX_LENGTH ? 'red.600' : 'text.300' }}
              color={message.length > MESSAGE_MAX_LENGTH ? 'red.300' : 'text.300'}
            >{`${message.length}/${MESSAGE_MAX_LENGTH}`}</Text>
          </Flex>
        </FormControl>
        <Button type='submit' my={2} alignSelf='end' minWidth='8rem' isLoading={isLoading}>
          <Flex gap={2} alignItems='center'>
            <LuSendHorizonal />
            {t('contact.send')}
          </Flex>
        </Button>
      </Form>
      {messageSent && <MessageSent onClose={onClose} />}
    </Box>
  );
};
const MessageSent = ({ onClose }: { onClose: () => void }) => {
  const { t } = useTranslation();
  return (
    <Flex direction='column' alignItems='center' justifyContent='center' gap={3} width='100%' height='100%' position='absolute' top={0} left={0}>
      <Icon as={BiMessageRoundedCheck} boxSize='3rem' />
      <Text fontSize='xl' fontWeight='bold'>
        {t('contact.messageSent')}
      </Text>
      <Text> {t('contact.feedbackThanks')}</Text>

      <Button onClick={onClose}>{t('contact.close')}</Button>
    </Flex>
  );
};

export default ContactModal;

import { Box, Button, Flex, FormControl, FormLabel, IconButton, Stack, Switch, Text } from '@chakra-ui/react';
import React, { useMemo } from 'react';
import AutoAvatar from '../../common/AutoAvatar';
import { LuTrash2 } from 'react-icons/lu';
import { useDesktopConnectionContext } from '../../../context/DesktopConnectionContext';
import { useTranslation } from 'react-i18next';
import FormatUtils from '../../../utils/FormatUtils';

const AuthorizedDevices = () => {
  const { authUsers, toggleAutoAuth, connection } = useDesktopConnectionContext();
  const { t } = useTranslation(undefined, { keyPrefix: 'settings' });
  const isEmpty = useMemo(() => !authUsers.list.length, [authUsers]);
  return (
    <>
      <FormControl>
        <FormLabel htmlFor='auto-auth' mb='0'>
          {t('devices.title')}
        </FormLabel>
        <Flex justifyContent='space-between'>
          <Text fontSize='sm'>{t('devices.description')}</Text>
          <Switch isChecked={connection.settings.automatic} id='auto-auth' colorScheme='primary' onChange={toggleAutoAuth} />
        </Flex>
      </FormControl>
      <Box>
        <Flex alignItems='baseline' justifyContent='space-between'>
          <FormLabel as='span' mb={0}>
            {t('authorizedDevices.title')}
          </FormLabel>

          {!isEmpty && (
            <Button variant='ghost' size='xs' fontWeight='medium' height='min-content' padding={2} onClick={() => authUsers.clear()}>
              {t('authorizedDevices.revokeAll')}
            </Button>
          )}
        </Flex>
        {!isEmpty ? (
          <Stack spacing={0} maxHeight={250} overflow='hidden' overflowY='auto' mt={1}>
            {authUsers.list.reverse().map((user) => (
              <Flex
                key={user.userId}
                gap={3}
                alignItems='center'
                paddingRight={2}
                _notLast={{ borderBottom: '1px', borderColor: 'borders.100' }}
                py={2}
              >
                <AutoAvatar size='sm' name={user.nickname} boxSize='30px' />
                <Stack spacing={0}>
                  <Text fontSize='sm' as='span' fontWeight='bold' lineHeight='short'>
                    {user.nickname}{' '}
                    <Text fontSize='xs' as='span' fontWeight='light' lineHeight='shorter'>
                      #{user.userId.slice(-5)}
                    </Text>
                  </Text>
                  <Text fontSize='xs' as='span'>
                    {FormatUtils.timeAgo(user.joinedAt)}
                  </Text>
                </Stack>
                <IconButton onClick={() => authUsers.remove(user)} marginLeft='auto' aria-label='delete' icon={<LuTrash2 />} size='sm' />
              </Flex>
            ))}
          </Stack>
        ) : (
          <Text fontSize='sm'> {t('authorizedDevices.empty')}</Text>
        )}
      </Box>
    </>
  );
};

export default AuthorizedDevices;

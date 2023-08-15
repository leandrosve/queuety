import { Box, Button, Flex, FormControl, FormLabel, IconButton, Stack, Switch, Text } from '@chakra-ui/react';
import { useMemo, useEffect } from 'react';
import AutoAvatar from '../../common/AutoAvatar';
import { LuTrash2 } from 'react-icons/lu';
import { useDesktopConnectionContext } from '../../../context/DesktopConnectionContext';
import { useTranslation } from 'react-i18next';
import FormatUtils from '../../../utils/FormatUtils';
import { useAllowedUsersContext } from '../../../context/AllowedUsersContext';

const AllowedUserList = () => {
  const { toggleAutoAuth, connection } = useDesktopConnectionContext();
  const allowedUsers = useAllowedUsersContext();
  const { t } = useTranslation(undefined, { keyPrefix: 'settings' });
  const isEmpty = useMemo(() => !allowedUsers.list.length, [allowedUsers]);

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
            <Button variant='ghost' size='xs' fontWeight='medium' height='min-content' padding={2} onClick={() => allowedUsers.clear()}>
              {t('authorizedDevices.revokeAll')}
            </Button>
          )}
        </Flex>
        {!isEmpty ? (
          <Stack spacing={0} maxHeight={250} overflow='hidden' overflowY='auto' mt={1}>
            {allowedUsers.list.map((user, index) => (
              <Flex key={index} gap={3} alignItems='center' paddingRight={2} _notLast={{ borderBottom: '1px', borderColor: 'borders.100' }} py={2}>
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
                <IconButton onClick={() => allowedUsers.remove(user)} marginLeft='auto' aria-label='delete' icon={<LuTrash2 />} size='sm' />
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

export default AllowedUserList;

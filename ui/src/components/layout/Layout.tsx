import { Flex, Icon, IconButton, Text, useColorMode } from '@chakra-ui/react';
import React, { PropsWithChildren } from 'react';
import { HiMoon, HiSun } from 'react-icons/hi';

const Layout = ({ children }: PropsWithChildren) => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <div className='app'>
      <Flex className='layout' gap={3} grow={1} zIndex={1}>
        <Flex as='header' shrink={0} justifyContent='space-between' alignItems='center' paddingTop={2} paddingX={2}>
          <Text as='span' color='text.300' fontWeight='bold'>Queuety</Text>
          <IconButton
            rounded='full'
            color='text.300'
            variant='ghost'
            icon={<Icon as={colorMode == 'dark' ? HiMoon : HiSun} />}
            aria-label='switch-theme'
            onClick={toggleColorMode}
          />
        </Flex>
        <Flex grow={1} alignItems='start' justifyContent='center'>
          {children}
        </Flex>
      </Flex>
    </div>
  );
};

export default Layout;

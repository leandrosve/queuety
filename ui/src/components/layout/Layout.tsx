import { Button, Flex, Icon, IconButton, Text, useColorMode } from '@chakra-ui/react';
import i18next from 'i18next';
import React, { PropsWithChildren } from 'react';
import { HiMoon, HiSun } from 'react-icons/hi';
import NavbarDesktop from './navbar/NavbarDesktop';

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div className='app'>
      <Flex className='layout' gap={3} grow={1} zIndex={1}>
        <NavbarDesktop />
        <Flex grow={1} alignItems='start' justifyContent='center'>
          {children}
        </Flex>
      </Flex>
    </div>
  );
};

export default Layout;

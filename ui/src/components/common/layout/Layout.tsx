import { Flex } from '@chakra-ui/react';
import { PropsWithChildren } from 'react';
import NavbarMobile from '../../app/mobile/layout/NavbarMobile';

interface Props extends PropsWithChildren {
  isMobile?: boolean;
}
const Layout = ({ children, isMobile }: Props) => {
  return (
    <Flex className='layout' gap={3} grow={1} zIndex={1}>
      <NavbarMobile />
      <Flex grow={1} alignItems='start' justifyContent='center'>
        {children}
      </Flex>
    </Flex>
  );
};

export default Layout;

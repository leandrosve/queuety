import { Flex, Spinner } from '@chakra-ui/react';

const FullPageSpinner = () => {
  return (
    <Flex alignItems='center' justifyContent='center' flex={1} className='full-page-spinner' alignSelf='stretch'>
      <Spinner size='lg' />
    </Flex>
  );
};

export default FullPageSpinner;

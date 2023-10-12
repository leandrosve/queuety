import { Box, Button, ButtonProps, Icon, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { LuCheckCircle } from 'react-icons/lu';

interface Props extends ButtonProps {
  onSubmit: (() => void) | (() => Promise<void>);
  disabledTimeout?: number;
  iconScaling?: [init: number, end: number];
}
const SubmitButton = ({ onSubmit, children, disabledTimeout, iconScaling = [0.8, 1.25], ...props }: Props) => {
  const [accepted, setAccepted] = useState(false);
  const handleSubmit = async () => {
    if (accepted) return;
    await Promise.all([onSubmit()]);
    setAccepted(true);
  };
  useEffect(() => {
    let timeout: number;
    if (accepted) {
      setTimeout(() => setAccepted(false), disabledTimeout ?? 2000);
    }
    return () => clearTimeout(timeout);
  }, [accepted]);
  return (
    <Button onClick={handleSubmit} position='relative' transition='background 500ms' background={accepted ? `primary.500` : undefined} {...props}>
      <Text as='span' opacity={accepted ? 0 : 1} transition='opacity 200ms'>
        {children}
      </Text>
      <Box
        visibility={accepted ? 'visible' : 'hidden'}
        opacity={accepted ? 1 : 0}
        transition='opacity 200ms'
        position='absolute'
        display='flex'
        top={0}
        left={'0'}
        height='100%'
        width='100%'
        alignItems='center'
        justifyContent='center'
      >
        <Icon
          as={LuCheckCircle}
          boxSize={'1.25rem'}
          transition='transform 500ms'
          transform={`scale(${accepted ? iconScaling[1] : iconScaling[0]})`}
        />
      </Box>
    </Button>
  );
};

export default SubmitButton;

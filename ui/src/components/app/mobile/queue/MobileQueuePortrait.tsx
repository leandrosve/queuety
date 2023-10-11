import { useState } from 'react';
import './mobileQueue.css';
import { Flex, Icon, IconButton } from '@chakra-ui/react';
import classNames from 'classnames';
import { LuChevronUp } from 'react-icons/lu';
import MobileQueueContent, { MobileQueueContentProps } from './MobileQueueContent';
import GlassContainer from '../../../common/glass/GlassContainer';

const MobileQueuePortrait = (contentProps: MobileQueueContentProps) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <Flex direction='column' grow={1} minHeight={0} position='relative' width='100%'>
      <Flex
        className={classNames('mobile-queue-content', { expanded })}
        borderTopRadius='xl'
        overflow='hidden'
        borderTop='1px'
        borderColor={'borders.100'}
      >
        <IconButton
          height='2rem'
          marginTop={2}
          borderRadius='lg'
          width='30vw'
          color='text.300'
          opacity={0.5}
          onClick={() => setExpanded((p) => !p)}
          aria-label='expand/collapse'
          variant='link'
          marginBottom='-1rem'
          icon={<Icon transition='all 500ms' boxSize='1.25rem' as={LuChevronUp} transform={`scaleY(${expanded ? '-100%' : 1})`} />}
        />
        <GlassContainer asBefore/>
        <MobileQueueContent {...contentProps} />
      </Flex>
    </Flex>
  );
};

export default MobileQueuePortrait;

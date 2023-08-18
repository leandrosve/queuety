import { motion, useMotionValue, useTransform } from 'framer-motion';
import { PropsWithChildren } from 'react';
import MobileQueue from './MobileQueue';

const DraggableSnackbar = ({ children }: PropsWithChildren) => {
  const y = useMotionValue(0);
  const background = useTransform(y, [-100, 0, 100], ['#ff008c', '#7700ff', 'rgb(230, 255, 0)']);
  return (
    <motion.div style={{background:'red'}}>
      <motion.div drag='y' dragConstraints={{ left: 0, right: 0, bottom: -0, top: -250 }} style={{ y }}>
        <MobileQueue/>
      </motion.div>
    </motion.div>
  );
};

export default DraggableSnackbar;

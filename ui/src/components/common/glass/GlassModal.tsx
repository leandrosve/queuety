import {
  Modal,
  ModalBody,
  ModalBodyProps,
  ModalCloseButton,
  ModalContent,
  ModalContentProps,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  ResponsiveValue,
} from '@chakra-ui/react';
import React, { ReactNode } from 'react';
import './glass.css';

interface Props extends ModalProps {
  title?: string | ReactNode;
  hasCloseButton?: boolean;
  minWidth?: string | ResponsiveValue<number | 'px'>;
  width?: string | ResponsiveValue<number | 'px'>;
  maxWidth?: string | ResponsiveValue<number | 'px'>;
  contentProps?: ModalContentProps;
  bodyProps?: ModalBodyProps;
}

const GlassModal = ({ children, title, hasCloseButton, minWidth, width, maxWidth, contentProps, bodyProps, ...props }: Props) => {
  return (
    <Modal allowPinchZoom {...props}>
      <ModalOverlay zIndex={10} />
      <ModalContent minWidth={minWidth} width={width} maxWidth={maxWidth} {...contentProps} className='glass-container'>
        {title && <ModalHeader>{title}</ModalHeader>}
        {hasCloseButton && <ModalCloseButton />}
        <ModalBody {...bodyProps}>{children}</ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default GlassModal;

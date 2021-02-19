import {
  Modal,
  ModalBody,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
  ModalFooter,
  ModalContent,
  Button,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { clearError } from '../state/reducers/apiErrorReducer';
import { ErrorState } from '../types';

const ErrorModal = () => {
  const [open, setOpen] = useState(false);
  const apiError = useSelector((state: ErrorState) => state.apiError);

  useEffect(() => {
    setOpen(apiError != null && apiError.message != null && apiError.message.length > 0);
  }, [apiError]);

  return (
    <Modal isOpen={open} onClose={clearError}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>API Error</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{apiError && <p>{apiError.message}</p>}</ModalBody>
        <ModalFooter>
          <Button colorScheme="red" mr={3} onClick={clearError}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ErrorModal;

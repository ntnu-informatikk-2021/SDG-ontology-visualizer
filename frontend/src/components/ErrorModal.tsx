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
import React, { useState } from 'react';
import { clearError } from '../state/reducers/apiErrorReducer';
import store from '../state/store';

const ErrorModal = () => {
  const [open, setOpen] = useState(false);

  store.subscribe(() => {
    setOpen(store.getState().apiError !== null);
  });

  return (
    <Modal isOpen={open} onClose={clearError}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Error!</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <p>{store.getState().apiError?.body.message}</p>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={clearError}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ErrorModal;

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
import store from '../state/store';

const ErrorModal = () => {
  const [open, setOpen] = useState(false);

  store.subscribe(() => {
    setOpen(store.getState().apiError !== null);
  });

  const closeModal = () => store.dispatch({ type: 'SET_ERROR', payload: null });

  return (
    <Modal isOpen={open} onClose={closeModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Error!</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <p>{store.getState().apiError?.body.message}</p>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={closeModal}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ErrorModal;

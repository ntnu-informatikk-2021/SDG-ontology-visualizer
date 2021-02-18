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
import React from 'react';
import { useRecoilState } from 'recoil';
import apiErrorState from '../state/apiErrorState';

const ErrorModal = () => {
  const [apiError, setApiError] = useRecoilState(apiErrorState);

  return (
    <>
      <Modal isOpen={apiError === true} onClose={() => setApiError(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Error!</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <p>Something went wrong. Please try again later or contact an administrator.</p>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={() => setApiError(false)}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ErrorModal;

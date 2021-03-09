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
import { useDispatch, useSelector } from 'react-redux';
import { clearError } from '../state/reducers/apiErrorReducer';
import { ApiError, ErrorState } from '../types/errorTypes';

const ErrorModal = () => {
  const [open, setOpen] = useState(false);
  const apiError = useSelector((state: ErrorState) => state.error);
  const dispatch = useDispatch();

  const onClose = () => dispatch(clearError());

  useEffect(() => {
    setOpen(apiError != null && apiError.message != null && apiError.message.length > 0);
  }, [apiError]);

  const errorHeader = apiError instanceof ApiError ? `API Error ${apiError.status}` : 'Error';

  return (
    <Modal isOpen={open} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{errorHeader}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{apiError && <p>{apiError.message}</p>}</ModalBody>
        <ModalFooter>
          <Button colorScheme="red" mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ErrorModal;

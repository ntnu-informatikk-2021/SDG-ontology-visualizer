import { ArrowLeftIcon } from '@chakra-ui/icons';
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { clearError } from '../../state/reducers/apiErrorReducer';
import { RootState } from '../../state/store';
import { ApiError } from '../../types/redux/errorTypes';

const ErrorModal: React.FC = () => {
  const [open, setOpen] = useState(false);
  const apiError = useSelector((state: RootState) => state.apiError.error);
  const dispatch = useDispatch();
  const history = useHistory();

  const onClose = () => dispatch(clearError());

  useEffect(() => {
    setOpen(apiError != null && apiError.message != null && apiError.message.length > 0);
  }, [apiError]);

  const errorHeader = apiError instanceof ApiError ? `API Error ${apiError.status}` : 'Feil';

  return (
    <Modal isOpen={open} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{errorHeader}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{apiError && <p>{apiError.message}</p>}</ModalBody>
        <ModalFooter>
          <Button
            size="sm"
            colorScheme="blue"
            leftIcon={<ArrowLeftIcon />}
            onClick={() => {
              onClose();
              history.push('/');
            }}
          >
            Tilbake til forsiden
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ErrorModal;

import React, {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import PropTypes from "prop-types";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  Input,
  FormLabel,
  useDisclosure,
  Button,
} from "@chakra-ui/react";

const ImageModal = (props, ref) => {
  const [imageUrl, setImageUrl] = useState("");
  const { handleClose, onSave, show } = props;

  useImperativeHandle(ref, () => ({
    clearImageUrl: () => {
      setImageUrl("");
    },
  }));

  //Initial Focus
  const initialRef = useRef();
  const finalRef = useRef();

  return (
    <Modal
      initialFocusRef={initialRef}
      finalFocusRef={finalRef}
      isOpen={show}
      onClose={handleClose}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Enter your image url</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl mt={4}>
            <FormLabel>Image Url</FormLabel>
            <Input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              size="md"
              placeholder="Image url"
            />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={() => onSave(imageUrl)}>
            Submit
          </Button>
          <Button onClick={handleClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

ImageModal.propTypes = {
  show: PropTypes.bool,
  handleClose: PropTypes.func,
  onSave: PropTypes.func,
};

ImageModal.defaultProps = {
  show: false,
};

export default forwardRef(ImageModal);

import React, { useState, useRef } from "react";
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
  InputGroup,
  InputRightElement,
  Switch,
} from "@chakra-ui/react";

const FormModal = (props) => {
  const [alreadyMember, setAlreadyMember] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { handleClose, onSave, show } = props;

  //Initial Focus
  const { onClose } = useDisclosure();
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
        <ModalHeader>Create your account</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl display="flex" alignItems="center">
            <FormLabel htmlFor="email-alerts" mb="0">
              Already member?
            </FormLabel>
            <Switch
              id="email-alerts"
              isChecked={alreadyMember}
              onChange={() => setAlreadyMember((prev) => !prev)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Name</FormLabel>
            <Input
              ref={initialRef}
              value={name}
              onChange={(e) => setName(e.target.value)}
              size="md"
              ref={initialRef}
              placeholder="Name"
            />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Email</FormLabel>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              size="md"
              type="email"
              placeholder="email"
            />
          </FormControl>

          {!alreadyMember ? (
            <FormControl mt={4}>
              <FormLabel>Password</FormLabel>
              <InputGroup size="md">
                <Input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  pr="4.5rem"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                />
                <InputRightElement width="4.5rem">
                  <Button
                    h="1.75rem"
                    size="sm"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
          ) : null}
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={() => onSave(alreadyMember, name, email, password)}
          >
            {alreadyMember ? "Login" : "Register"}
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

FormModal.propTypes = {
  show: PropTypes.bool,
  handleClose: PropTypes.func,
  onSave: PropTypes.func,
};

FormModal.defaultProps = {
  show: false,
};

export default FormModal;

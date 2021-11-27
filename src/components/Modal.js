import React, { useState } from "react";
import PropTypes from "prop-types";
import { Form, Modal, Button, InputGroup, FormControl } from "react-bootstrap";

const FormModal = (props) => {
  const [isLogin, setLogin] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { handleClose, onSave, show } = props;
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{`${
          isLogin ? "Login" : "Register"
        } with Email`}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div></div>
      </Modal.Body>
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

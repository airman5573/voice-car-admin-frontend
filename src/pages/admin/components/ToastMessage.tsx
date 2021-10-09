import React from "react";
import { Card, Form, Button, Toast } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { VC } from "../../../utils/types";
import { UPDATE_ADMIN_PASSWORD } from "../../../utils/query";

const ToastMessage = () => {
  return (
    <Toast
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
      }}
    >
      <Toast.Header>
        <img src="holder.js/20x20?text=%20" className="rounded mr-2" alt="" />
        <strong className="mr-auto">Bootstrap</strong>
        <small>just now</small>
      </Toast.Header>
      <Toast.Body>Woohoo, you're reading this text in a Toast!</Toast.Body>
    </Toast>

  );
}

export default ToastMessage;
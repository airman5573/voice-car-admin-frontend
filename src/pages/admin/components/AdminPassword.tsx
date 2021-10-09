import React, { Fragment, useEffect, useState } from "react";
import { Card, Form, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { _toast } from "../../../utils";
import { RootState, useAppDispatch, useAppSelector } from "../../../redux";
import { fetchAdminPassword, updateAdminPassword } from "../../../redux/features/adminPasswordSlice";
import { VC } from "../../../utils/types";
import { UPDATE_ADMIN_PASSWORD } from "../../../utils/query";
import { ACCESSTOKEN_ID, ErrorMessages, shouldRedirect } from "../../../utils/const";
import { unwrapResult } from "@reduxjs/toolkit";

const AdminPassword = ({}) => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchAdminPassword());
  }, []);
  const { register, handleSubmit, reset} = useForm<VC.AdminPasswordFormValue>();

  const {
    password,
    fetchPending, fetchError,
    updatePending, updateError
  } = useAppSelector((state: RootState) => state.adminPassword);
  const placeholder = password ? `비밀번호 : ${password}` : '비밀번호를 입력해주세요';

  const [errorMessage, setErrorMessage] = useState(fetchError?.message);

  const displayError = (message: string) => {
    _toast.error(message);
    setErrorMessage(message);
  }

  if (fetchError) {
    displayError(fetchError.message);
    if (shouldRedirect(fetchError.code)) {
      localStorage.removeItem(ACCESSTOKEN_ID);
      setTimeout(() => {
        window.location.href = '/login';
      }, 1000);
    }
  }

  if (updateError) {
    displayError(updateError.message);
  }

  const onSubmit = (data: VC.AdminPasswordFormValue) => {
    const { password } = data;
    if (password.length < 4) {
      displayError(ErrorMessages.SHORT_PASSWORD);
      return;
    }
    dispatch(updateAdminPassword(password)).then(unwrapResult)
    .then((password) => {
      setErrorMessage(undefined);
      _toast.success(`${password}로 비밀번호가 변경되었습니다`);
    });
    reset();
  };

  return (
    <Fragment>
      <Card>
        <Card.Body>
          <Card.Title>관리자 비밀번호</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">관리자 비밀번호를 변경합니다.</Card.Subtitle>
          <Form onSubmit={handleSubmit(onSubmit)} className="mt-4">
            <Form.Row>
              <Form.Control placeholder={placeholder} {...register("password")} isInvalid={!!errorMessage}/>
              <Form.Control.Feedback type="invalid">
                {errorMessage}
              </Form.Control.Feedback>
            </Form.Row>
            <Form.Row className="mt-2 d-flex justify-content-end">
              <Button variant="primary" type="submit" disabled={fetchPending || updatePending} block>확인</Button>
            </Form.Row>
          </Form>
        </Card.Body>
      </Card>
    </Fragment>
  );
};

export default AdminPassword;
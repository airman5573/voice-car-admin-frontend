import React, { FC, useState } from "react";
import {Container, Row, Form, Button} from "react-bootstrap";
import { useForm } from "react-hook-form";
import { VC } from "../../utils/types";
import { Redirect } from 'react-router-dom';
import { ACCESSTOKEN_ID } from "../../utils/const";
import { client } from "../../utils/global";
import { ApolloError } from "@apollo/client";
import { LOGIN } from "../../utils/query";
import { _toast } from "../../utils";

const Login = () => {
  const [token, setToken] = useState<string|null>(localStorage.getItem(ACCESSTOKEN_ID));
  const [errorMessage, setErrorMessage] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const { register, handleSubmit, formState: { errors } } = useForm<VC.AdminPasswordFormValue>();
  const onSubmit = ({ password }: VC.AdminPasswordFormValue) => {
    setLoading(true);
    client.query<{login: string}>({ query: LOGIN, variables: { password } })
      .then(({ errors, data }) => {
        if (errors && errors.length > 0) {
          let message = errors[0].message;
          setErrorMessage(message);
          setLoading(false);
          _toast.error(message);
          return;
        }
        const { login: token } = data;
        localStorage.setItem(ACCESSTOKEN_ID, token);
        setToken(token);
      })
      .catch((err: ApolloError) => {
        setLoading(false);
        setErrorMessage(err.message);
        _toast.error(err.message);
      });
  }

  // token이 있다면, localStorage에 넣고 admin page로 이동한다
  // admin page에서 알아서 토큰의 유효성검사를 하기 때문에 여기서 해줄 필요는 없다
  if (token && token.length > 1) {
    localStorage.setItem(ACCESSTOKEN_ID, token);
    return <Redirect to={"/"}></Redirect>
  }

  return (
    <div className="login-page">
      <div className="inner">
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Container>
            <Form.Row>
              <Form.Control type="password" placeholder="비밀번호를 입력해주세요" {...register("password")} isInvalid={!!errorMessage}/>
              <Form.Control.Feedback type="invalid">
                {errorMessage}
              </Form.Control.Feedback>
            </Form.Row>
            <Form.Row className="mt-2">
              <Button variant="primary" type="submit" disabled={loading} block>로그인</Button>
            </Form.Row>
          </Container>
        </Form>
      </div>
    </div>
  )
}

export default Login;
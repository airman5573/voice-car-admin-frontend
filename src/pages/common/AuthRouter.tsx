import React, { FC, ReactElement, useEffect, useState } from "react";
import { Route, Redirect } from "react-router-dom";
import { VC } from "../../utils/types";
import { ACCESSTOKEN_ID } from "../../utils/const";
import { LOGIN, VERIFY_ACCESS_TOKEN } from "../../utils/query";
import { client } from "../../utils/global";
import { ApolloError } from "@apollo/client";
import { getErrorCode } from "../../utils";

const AuthRoute: FC<VC.AuthRouteProps> = ({render, component: Component, redirectTo, ...rest}): ReactElement => {
  const [isVertifing, setIsVertifing] = useState(true);
  const [error, setError] = useState<ApolloError>();
  let accessToken = localStorage.getItem(ACCESSTOKEN_ID);
  
  useEffect(() => {
    if (accessToken === null) return; // accesstoken이 없는데 query를 날리면, unmount된 컴포넌트를 다시 그리게 되니까 처리해준다.
    client.query({query: VERIFY_ACCESS_TOKEN, variables: { token: accessToken }})
      .then(data => {
        setIsVertifing(false);
        setError(undefined);
      })
      .catch((err: ApolloError) => {
        localStorage.removeItem(ACCESSTOKEN_ID);
        setIsVertifing(false);
        setError(err);
      });
  }, []);

  const redirect = <Redirect to={{ pathname: redirectTo }} />
  if (accessToken === null || (error && getErrorCode(error)) === 'INVALID_ACCESS_TOKEN') return redirect;

  if (error) return <div>{error.message}</div>
  if (isVertifing) return <div>Loading...</div>

  return (
    <Route
      {...rest}
      render={(props) =>
        render ? (
          render(props)
        )
        : Component ? (
          <Component {...props}></Component>
        )
        : ({})
      }
    />
  );
}

export default AuthRoute;
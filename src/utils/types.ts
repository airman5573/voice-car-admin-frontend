import React, { FC, ReactElement } from "react";
import { RouteProps } from "react-router";
import { defaultCommands } from "./const";

export namespace VC {
  export type TeamPassword = {
    team: number,
    password: string
  }
  export interface InitialSetting {
    teamPasswords: TeamPassword[],
    adminPassword: string
  }
  export interface AdminPasswordFormValue {
    password: string
  }
  export interface AuthRedirectProps {
    destination: string
  }
  export interface AuthRouteProps extends RouteProps {
    redirectTo: string
  }
  export interface CardProps {
    title: string
  }
  export type ErrorInfo = {
    code: string,
    message: string,
  } | undefined;
  export type FetchState = {
    fetchPending: boolean,
    fetchError: ErrorInfo
  }
  export type UpdateState = {
    updatePending: boolean,
    updateError: ErrorInfo
  }
  export type DefaultNetworkingState = FetchState & UpdateState
  export type Command = {
    nameKR: string,
    nameEN: string,
    speed: number,
    similarWords: [string]
  }
  export type TeamCommands = {
    team: number,
    commands: typeof defaultCommands
  }
}
declare global {
  interface Window { __group__: string }
  const __DEVELOPMENT__: Boolean;
}
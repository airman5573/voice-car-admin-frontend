import { VC } from './types';

export const enum ErrorCode {
  INVALID_ACCESS_TOKEN = 'INVALID_ACCESS_TOKEN',
  NOT_LOGGEDIN = 'NOT_LOGGEDIN',
}
export const ErrorMessages = {
  SHORT_PASSWORD: '비밀번호가 너무 짧습니다',
  TEAM_PASSWORD: '팀 비밀번호 입력에 에러가 있습니다',
  TEAM_PASSWORD_EMPTY: '비밀번호를 입력해주시기 바랍니다',
  TEAM_PASSWORD_SPECIAL_CHARACTERS: '팀 비밀번호에 특수문자 혹은 스페이스바는 허용하지 않습니다',
  TEAM_PASSWORD_PREFIX: '비밀번호는 a혹은 b로 시작해야합니다',
  TEAM_PASSWORD_DUPLICATION: '비밀번호는 중복을 허용하지 않습니다'
}
export const ACCESSTOKEN_ID = 'vc_access_token';
export function shouldRedirect(code: string) {
  let codes = [
    ErrorCode.INVALID_ACCESS_TOKEN.toString(),
    ErrorCode.NOT_LOGGEDIN.toString()
  ];
  return codes.includes(code);
}
export const DefaultNetworkingState: VC.DefaultNetworkingState = {
  fetchPending: false,
  fetchError: undefined,
  updatePending: false,
  updateError: undefined,
}
export const defaultCommands = {
  handOpen: {
    nameKR: "손펴",
    nameEN: "hand_open",
    speed: 0,
    similarWords: [""]
  },
  handClose: {
      nameKR: "손접어",
      nameEN: "hand_close",
      speed: 0,
      similarWords: [""]
  },
  elbowOpen: {
      nameKR: "팔펴",
      nameEN: "elbow_open",
      speed: 0,
      similarWords: [""]
  },
  elbowClose: {
      nameKR: "팔접어",
      nameEN: "elbow_close",
      speed: 0,
      similarWords: [""]
  },
  shoulderOpen: {
      nameKR: "팔들어",
      nameEN: "shoulder_open",
      speed: 0,
      similarWords: [""]
  },
  shoulderClose: {
      nameKR: "팔내려",
      nameEN: "shoulder_close",
      speed: 0,
      similarWords: [""]
  },
  waistLeft: {
      nameKR: "몸왼쪽",
      nameEN: "waist_left",
      speed: 0,
      similarWords: [""]
  },
  waistRight: {
      nameKR: "몸오른쪽",
      nameEN: "waist_right",
      speed: 0,
      similarWords: [""]
  },
  bottomGo: {
      nameKR: "앞으로",
      nameEN: "bottom_go",
      speed: 0,
      similarWords: [""]
  },
  bottomBack: {
      nameKR: "뒤로",
      nameEN: "bottom_back",
      speed: 0,
      similarWords: [""]
  },
  bottomLeft: {
      nameKR: "왼쪽",
      nameEN: "bottom_left",
      speed: 0,
      similarWords: [""]
  },
  bottomRight: {
      nameKR: "오른쪽",
      nameEN: "bottom_right",
      speed: 0,
      similarWords: [""]
  },
  bottomGoFast: {
      nameKR: "빠르게",
      nameEN: "bottom_go_fast",
      speed: 0,
      similarWords: [""]
  }
}
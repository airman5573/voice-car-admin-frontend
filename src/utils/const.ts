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

export const defaultTeams = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

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

export const testCmds = {
  handOpen: {
    nameEN: 'handOpen',
    nameKR: '손펴',
    column: 'hand_open',
    code: 11,
    stop: 10,
    speed: 60,
  },
  handClose: {
    nameEN: 'handClose',
    nameKR: '손잡아',
    column: 'hand_close',
    code: 12,
    stop: 10,
    speed: 60,
  },
  elbowOpen: {
    nameEN: 'elbowOpen',
    nameKR: '팔펴',
    column: 'elbow_open',
    code: 21,
    stop: 20,
    speed: 90,
  },
  elbowClose: {
    nameEN: 'elbowClose',
    nameKR: '팔접어',
    column: 'elbow_close',
    code: 22,
    stop: 20,
    speed: 60,
  },
  shoulderOpen: {
    nameEN: 'shoulderOpen',
    nameKR: '들어',
    column: 'shoulder_open',
    code: 23,
    stop: 20,
    speed: 100,
  },
  shoulderClose: {
    nameEN: 'shoulderClose',
    nameKR: '내려',
    column: 'shoulder_close',
    code: 24,
    stop: 20,
    speed: 100,
  },
  waistLeft: {
    nameEN: 'waistLeft',
    nameKR: '몸통 왼쪽',
    column: 'waist_left',
    code: 31,
    stop: 30,
    speed: 40,
  },
  waistRight: {
    nameEN: 'waistRight',
    nameKR: '몸통 오른쪽',
    column: 'waist_right',
    code: 32,
    stop: 30,
    speed: 40,
  },
  bottomGo: {
    nameEN: 'bottomGo',
    nameKR: '앞으로',
    column: 'bottom_go',
    code: 41,
    stop: 40,
    speed: 60,
  },
  bottomBack: {
    nameEN: 'bottomBack',
    nameKR: '뒤로',
    column: 'bottom_back',
    code: 42,
    stop: 40,
    speed: 60,
  },
  bottomLeft: {
    nameEN: 'bottomLeft',
    nameKR: '왼쪽',
    column: 'bottom_left',
    code: 43,
    stop: 40,
    speed: 40,
  },
  bottomRight: {
    nameEN: 'bottomRight',
    nameKR: '오른쪽',
    column: 'bottom_right',
    code: 44,
    stop: 40,
    speed: 40,
  },
  bottomGoFast: {
    nameEN: 'bottomGoFast',
    nameKR: '빠르게',
    column: 'bottom_go_fast',
    code: 45,
    stop: 40,
    speed: 100,
  }
};

export const cmdNames = [
  'handOpen', 'handClose',
  'elbowOpen', 'elbowClose', 'shoulderOpen', 'shoulderClose',
  'waistLeft', 'waistRight',
  'bottomGo', 'bottomGoFast', 'bottomLeft', 'bottomRight', 'bottomBack'
];
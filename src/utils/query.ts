import { gql } from "@apollo/client";

export const VERIFY_ACCESS_TOKEN = gql `
  query verifyAccessToken($token: String!) {
    verifyAccessToken(token: $token)
  }
`;

export const LOGIN = gql `
  query login($password: String!) {
    login(password: $password)
  }
`;

export const FETCH_ADMIN_PASSWORD = gql `
  query {
    meta {
      adminPassword
    }
  }
`;

export const UPDATE_ADMIN_PASSWORD = gql `
  mutation updateAdminPassword($password: String!) {
    updateAdminPassword(password: $password)
  } 
`;

export const FETCH_CONTROLMODE = gql `
  query {
    meta {
      controlMode
    }
  }
`;

export const UPDATE_CONTROLMODE = gql `
  mutation updateControlMode($mode: ControlMode) {
    updateControlMode(mode: $mode)
  }
`;

export const FETCH_ALL_TEAM_PASSWORDS = gql `
  query {
    allTeamPasswords {
      team
      password
    }
  }
`;

export const UPDATE_TEAM_PASSWORDS = gql `
  mutation updateTeamPasswords($teamPasswords: [TeamPasswordInput]) {
    updateTeamPasswords(teamPasswords: $teamPasswords) {
      team,
      password
    }
  }
`;

export const RESET = gql `
  mutation {
    reset
  }
`;

export const RESET_SIMILARWORDS = gql `
  mutation {
    resetSimilarWords
  }
`;

export const VACATE_SIMILARWORDS = gql `
  mutation {
    vacateSimilarWords
  }
`;

export const RESET_SPEEDS = gql `
  mutation {
    resetSpeeds
  }
`;

export const VACATE_SPEEDS = gql `
  mutation {
    vacateSpeeds
  }
`;

export const FETCH_TEAM_COMMANDS = gql `
  query {
    teamCommands(teams: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) {
      team,
      commands {
        handOpen { ...allCommandFields },
        handClose { ...allCommandFields },
        elbowOpen { ...allCommandFields },
        elbowClose { ...allCommandFields },
        shoulderOpen { ...allCommandFields },
        shoulderClose { ...allCommandFields },
        waistLeft { ...allCommandFields },
        waistRight { ...allCommandFields },
        bottomGo { ...allCommandFields },
        bottomGoFast { ...allCommandFields },
        bottomLeft { ...allCommandFields },
        bottomRight { ...allCommandFields },
        bottomBack { ...allCommandFields },
      }
    }
  }

  fragment allCommandFields on Command {
    team,
    nameEN,
    nameKR,
    speed,
    similarWords,
    code,
    stop
  }
`;
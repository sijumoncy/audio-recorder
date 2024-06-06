export interface IToken {
  token: string;
  token_expiration: number;
}

/**
 *  --------------------------   WEB TO PROVIDER --------------------------
 */
export enum CloudWebToProviderMsgTypes {
  RequestToLogin = 'call for login to cloud',
  CheckToken = 'Call to check for Auth',
}

export type LoginData = {
  access_key_id: string;
  secret_access_key: string;
};

export type CloudWebToExtData = LoginData;

export type CloudUIToExtMsg = {
  type: CloudWebToProviderMsgTypes;
  data: CloudWebToExtData | null;
};

/**
 *  --------------------------  PROVIDER TO WEB --------------------------
 */

export enum CloudProviderToWebMsgTypes {
  LoginResponse = 'Response of login',
}

export type LoginResponse = {
  loggedIn: boolean;
  data: any;
};

export type CloudExtToUIData = LoginResponse;

export type CloudExtToUIMsg = {
  type: CloudProviderToWebMsgTypes;
  data: CloudExtToUIData;
};

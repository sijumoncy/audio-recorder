/**
 *  --------------------------   WEB TO PROVIDER --------------------------
 */
export enum CloudWebToProviderMsgTypes {
  RequestToLogin = 'call for login to cloud',
}

export type LoginData = {
  access_key_id: string;
  secret_access_key: string;
};

export type CloudWebToExtData = LoginData;

export type CloudUIToExtMsg = {
  type: CloudWebToProviderMsgTypes;
  data: CloudWebToExtData;
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

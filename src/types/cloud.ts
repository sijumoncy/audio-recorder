export interface IToken {
  token: string;
  token_expiration: number;
}

export interface IAPIPaginationObj {
  has_more: boolean;
  max_per_page: number;
  next_offset: string;
  results: number;
}

export interface IRepo {
  creation_date: number;
  default_branch: string;
  id: string;
  read_only: boolean;
  storage_namespace: string;
}

export interface IGetRepoResponse {
  pagination: IAPIPaginationObj;
  results: IRepo[];
}

/**
 *  --------------------------   WEB TO PROVIDER --------------------------
 */
export enum CloudWebToProviderMsgTypes {
  RequestToLogin = 'call for login to cloud',
  CheckToken = 'Call to check for Auth',
  Logout = 'call action to logout session',
  FetchProjects = 'get projects from cloud',
  syncCurrentProject = 'sync current project to cloud',
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
  ProjectsList = 'project / repo data',
}

export type LoginResponse = {
  loggedIn: boolean;
  data: any;
};

export type CloudExtToUIData = LoginResponse | IRepo[];

export type CloudExtToUIMsg = {
  type: CloudProviderToWebMsgTypes;
  data: CloudExtToUIData;
};

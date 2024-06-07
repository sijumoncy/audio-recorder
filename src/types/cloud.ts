import { Interface } from 'readline';

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

export interface IObjectUploadAPIResponse {
  checksum: string;
  content_type: string;
  metadata: { [key: string]: String };
  mtime: number;
  path: string;
  path_type: string;
  physical_address: string;
  size_bytes: number;
}

export interface IReponseListFiles {
  pagination: IAPIPaginationObj;
  results: Omit<IObjectUploadAPIResponse, 'metadata'>[];
}

/**
 *  --------------------------   WEB TO PROVIDER --------------------------
 */
// enum for msg type from web sidebar ui to provider
export enum CloudWebToProviderMsgTypes {
  RequestToLogin = 'call for login to cloud',
  CheckToken = 'Call to check for Auth',
  Logout = 'call action to logout session',
  FetchProjects = 'get projects from cloud',
  syncCurrentProject = 'sync current project to cloud',
  selectProject = 'select project to show details panel',
}

// enum for msg type from web panel to panel provider
export enum CloudWebPanelToProviderMsgTypes {
  CheckAuthAndRepoData = 'initial call to check auth and get the repo data',
}

export type LoginData = {
  access_key_id: string;
  secret_access_key: string;
};

export type CloudWebToExtData = LoginData;

export type CloudUIToExtMsg = {
  type: CloudWebToProviderMsgTypes | CloudWebPanelToProviderMsgTypes;
  data: CloudWebToExtData | null | string;
};

/**
 *  --------------------------  PROVIDER TO WEB --------------------------
 */

//
export enum CloudProviderToWebMsgTypes {
  LoginResponse = 'Response of login',
  ProjectsList = 'project / repo data',
}

// enum for msg type from web panel to panel provider
export enum CloudPanelProviderToWebMsgTypes {
  AuthRepoResponse = 'AUthandRepoResponse on start',
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

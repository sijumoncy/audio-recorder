import * as vscode from 'vscode';
import { getNonce } from '../../utils/getNonce';
import axios from 'axios';
import * as path from 'path';
import {
  CloudPanelProviderToWebMsgTypes,
  CloudProviderToWebMsgTypes,
  CloudUIToExtMsg,
  CloudWebPanelToProviderMsgTypes,
  CloudWebToProviderMsgTypes,
  IGetRepoResponse,
  IRepo,
  IToken,
} from '../../types/cloud';
import { storageKeys } from '../../types/storage';
import { environment } from '../../environment';
import { projectSync } from './Functions/projectSync';
import { IAudioBurrito } from '../../types/audio';
import {
  getCommitsOfPathPrefixes,
  getRepo,
  listRepoContentsWithPattern,
} from './Functions/cloudUtils';

export class CloudPanelWebViewProvider {
  private panel: vscode.WebviewPanel | undefined;
  private static readonly viewType = 'audio-explorer-cloud-panel';
  private _context: vscode.ExtensionContext;
  private readonly globalState: vscode.Memento;
  private _token: IToken | null;
  private _repoData: [];
  private _selectedProject: string | undefined;

  /**
   * Constructor
   */
  constructor(private readonly context: vscode.ExtensionContext) {
    this._context = context;
    this.globalState = context.workspaceState;
    this._token = null;
    this._repoData = [];
    this.getSecret(storageKeys.cloudUserToken);
    this._selectedProject = this.getGlobalState(
      storageKeys.selectedCloudProject,
    );

    // Create and configure the webview panel
    this.panel = vscode.window.createWebviewPanel(
      CloudPanelWebViewProvider.viewType,
      'Project Details', // panel tab title
      vscode.ViewColumn.Beside,
      {
        enableScripts: true,
        localResourceRoots: [
          vscode.Uri.file(path.join(context.extensionPath, 'src')),
          vscode.Uri.file(
            path.join(
              vscode.workspace.workspaceFolders?.[0].uri.fsPath as string,
            ),
          ),
        ],
      },
    );

    // set UI here
    if (this.panel) {
      this.panel.webview.html = this.getHtmlForEditoPanel(this.panel.webview);

      /**
       * Handle recieve message from webview
       */
      this.panel.webview.onDidReceiveMessage(
        async (e: {
          type: CloudWebPanelToProviderMsgTypes;
          data: CloudUIToExtMsg;
        }) => {
          switch (e.type) {
            case CloudWebPanelToProviderMsgTypes.CheckAuthAndRepoData: {
              const token = await this.getSecret(storageKeys.cloudUserToken);
              // TODO : Need to check the expiry of the token here

              if (token?.token && this._selectedProject) {
                // get repo contents of file list
                const selectedRepo = await getRepo(
                  token.token,
                  this._selectedProject,
                );
                if (selectedRepo?.id) {
                  const repoFiles = await listRepoContentsWithPattern(
                    token.token,
                    selectedRepo.id,
                    selectedRepo.default_branch,
                  );

                  if (this.panel?.webview) {
                    this.postMessage(this.panel.webview, {
                      type: CloudPanelProviderToWebMsgTypes.AuthRepoResponse,
                      data: {
                        loggedIn: !!token?.token,
                        data: { repoBase: selectedRepo, file: repoFiles } || [],
                      },
                    });
                  }
                }
              }

              break;
            }

            case CloudWebPanelToProviderMsgTypes.getPathVersion: {
              const inputData = e.data as unknown as {
                path: string;
                repo: IRepo;
              };
              // { path: path, repo: repoData }
              const token = await this.getSecret(storageKeys.cloudUserToken);
              if (token?.token && this._selectedProject) {
                const filepathVersionData = await getCommitsOfPathPrefixes(
                  token.token,
                  inputData.repo.id,
                  inputData.repo.default_branch,
                  inputData.path,
                );

                console.log('filepathVersionData : ', filepathVersionData);
                if (this.panel?.webview && filepathVersionData) {
                  this.postMessage(this.panel.webview, {
                    type: CloudPanelProviderToWebMsgTypes.pathVersionResponse,
                    data: filepathVersionData,
                  });
                }
              }
              break;
            }
          }
        },
      );
    }

    // Dispose of the panel when it is closed
    this.panel.onDidDispose(() => {
      this.panel = undefined;
    });
  }
  /**
   * Send Message or event from EDITOR to Webview
   */
  private postMessage(webview: vscode.Webview, message: any) {
    webview.postMessage(message);
  }

  // Method to update the global state
  public updateGlobalState(key: string, value: any) {
    this.globalState.update(key, value);
  }

  // Method to retrieve data from the global state
  public getGlobalState(key: string): any {
    return this.globalState.get(key);
  }

  /**
   * Public method to convert normal file uri to webview uri
   */
  public async convertToAsWebViewUri(url: vscode.Uri) {
    if (this.panel) {
      const webviewUri = this.panel.webview.asWebviewUri(url);
      return webviewUri.toString();
    }
    return undefined;
  }

  /**
   * store secrets
   */
  private async storeSecret(key: string, value: string) {
    await this.context.secrets.store(key, value);
  }

  /**
   * get secrets
   */
  private async getSecret(key: string) {
    const tokenData = await this.context.secrets.get(key);
    this._token = tokenData ? JSON.parse(tokenData) : tokenData;
    return this._token;
  }

  /**
   * delete secrets
   */
  private async removeSecret(key: string) {
    await this.context.secrets.delete(key);
    this._token = null;
  }

  // Method to dispose the panel
  public dispose() {
    if (this.panel) {
      this.panel.dispose();
      this.panel = undefined;
    }
  }

  /**
   * Function to get the html of the Webview
   */
  private getHtmlForEditoPanel(webview: vscode.Webview): string {
    // Local path to script and css for the webview
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(
        this._context.extensionUri,
        'src',
        'webview-dist',
        'CloudPanelView',
        'index.js',
      ),
    );

    const codiconsUri = webview.asWebviewUri(
      vscode.Uri.joinPath(
        this._context.extensionUri,
        'node_modules',
        '@vscode',
        'codicons',
        'dist',
        'codicon.css',
      ),
    );

    const styleVSCodeUri = webview.asWebviewUri(
      vscode.Uri.joinPath(
        this._context.extensionUri,
        'src',
        'webview-dist',
        'CloudPanelView',
        'index.css',
      ),
    );

    // Use a nonce to whitelist which scripts can be run
    const nonce = getNonce();

    return /* html */ `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            
            <meta http-equiv="Content-Security-Policy" content="default-src *; img-src ${webview.cspSource} http: https:;
              script-src ${webview.cspSource}; 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'unsafe-inline' http: https: data: *;">
            
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            
            <link href="${styleVSCodeUri}" rel="stylesheet" />
            <link href="${codiconsUri}" rel="stylesheet" />
            
            <title>Scribe Cloud Panel</title>
        </head>
        <body>
            <div id="root"></div>
            <script nonce="${nonce}" src="${scriptUri}"></script>
        </body>
        </html>
    `;
  }
}

export let CloudPanelProviderInstance: CloudPanelWebViewProvider | undefined;

export async function initCloudPanel(context: vscode.ExtensionContext) {
  if (CloudPanelProviderInstance) {
    CloudPanelProviderInstance.dispose();
  }
  CloudPanelProviderInstance = new CloudPanelWebViewProvider(context);
  return CloudPanelProviderInstance;
}

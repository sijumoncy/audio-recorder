import * as vscode from 'vscode';
import { getNonce } from '../../utils/getNonce';
import axios from 'axios';
import {
  CloudProviderToWebMsgTypes,
  CloudUIToExtMsg,
  CloudWebToProviderMsgTypes,
  IGetRepoResponse,
  IRepo,
  IToken,
} from '../../types/cloud';
import { storageKeys } from '../../types/storage';
import { environment } from '../../environment';

export class CloudSidebarWebViewProvider implements vscode.WebviewViewProvider {
  /**
   * register custom nav sidebar provider
   * pass view type (unique id) and context
   */
  public static register(context: vscode.ExtensionContext): vscode.Disposable {
    return vscode.window.registerWebviewViewProvider(
      CloudSidebarWebViewProvider.viewType,
      new CloudSidebarWebViewProvider(context),
    );
  }

  private static readonly viewType = 'audio-explorer-cloud';

  private _webviewView: vscode.WebviewView | undefined;
  private _context: vscode.ExtensionContext;
  private readonly globalState: vscode.Memento;
  private _token: IToken | null;
  private _projects: [];

  constructor(private readonly context: vscode.ExtensionContext) {
    this._context = context;
    this.globalState = context.workspaceState;
    this._token = null;
    this._projects = [];
    this.getSecret(storageKeys.cloudUserToken);
  }

  /**
   * web view resolve function
   */
  public async resolveWebviewView(
    webviewPanel: vscode.WebviewView,
    ctx: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken,
  ): Promise<void> {
    webviewPanel.webview.options = {
      enableScripts: true,
      //   localResourceRoots: [],
    };

    webviewPanel.webview.html = this.getHtmlForWebview(webviewPanel.webview);

    /**
     * Handle recieve message from webview
     */
    webviewPanel.webview.onDidReceiveMessage(
      async (e: {
        type: CloudWebToProviderMsgTypes;
        data: CloudUIToExtMsg;
      }) => {
        switch (e.type) {
          // Initial check for session
          case CloudWebToProviderMsgTypes.CheckToken: {
            const token = await this.getSecret(storageKeys.cloudUserToken);
            // TODO : Need to check the expiry of the token here
            this.postMessage(webviewPanel.webview, {
              type: CloudProviderToWebMsgTypes.LoginResponse,
              data: {
                loggedIn: !!token?.token,
                data: null,
              },
            });

            break;
          }

          // Request Login Try to Login
          case CloudWebToProviderMsgTypes.RequestToLogin: {
            console.log('data  : ', e.data);

            try {
              const response = await axios.post(
                `${environment.BASE_CLOUD_URL}/auth/login`,
                e.data,
              );
              const tokenData = response.data;
              webviewPanel.webview.postMessage({
                type: CloudProviderToWebMsgTypes.LoginResponse,
                data: {
                  loggedIn: true,
                  data: null,
                },
              });

              if (tokenData?.token) {
                // store the token data
                this._token = tokenData;
                this.storeSecret(
                  storageKeys.cloudUserToken,
                  JSON.stringify(tokenData),
                );
              }
            } catch (error) {
              console.log('errr : ', error);
              webviewPanel.webview.postMessage({
                type: CloudProviderToWebMsgTypes.LoginResponse,
                data: {
                  loggedIn: false,
                  data: null,
                },
              });
            }

            break;
          }

          // logout
          case CloudWebToProviderMsgTypes.Logout: {
            await this.removeSecret(storageKeys.cloudUserToken);
            this.postMessage(webviewPanel.webview, {
              type: CloudProviderToWebMsgTypes.LoginResponse,
              data: {
                loggedIn: !!this._token?.token,
                data: null,
              },
            });
          }

          // get projects
          case CloudWebToProviderMsgTypes.FetchProjects: {
            // TODO : All TOken Checks needs to be changed with expiry time validation
            // TODO : Check current open projects name and if open only fetch that and auto display other panels
            if (this._token) {
              try {
                const response = await axios.get(
                  `${environment.BASE_CLOUD_URL}/repositories`,
                  { headers: { Authorization: `Bearer ${this._token.token}` } },
                );
                const data = response.data as IGetRepoResponse;
                const projects = data.results;

                webviewPanel.webview.postMessage({
                  type: CloudProviderToWebMsgTypes.ProjectsList,
                  data: projects,
                });
              } catch (error) {
                console.log('errr fetch project : ', error);
                vscode.window.showErrorMessage(`Unable to get Project`);
              }
            }
          }

          default:
            break;
        }
      },
    );
  }

  /**
   * Send Message or event from EDITOR to Webview
   */
  private postMessage(webview: vscode.Webview, message: any) {
    webview.postMessage(message);
  }

  /**
   * Function to get the html of the Webview
   */
  private getHtmlForWebview(webview: vscode.Webview): string {
    // Local path to script and css for the webview
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(
        this._context.extensionUri,
        'src',
        'webview-dist',
        'CloudSideBarView',
        'index.js',
      ),
    );
    const styleVSCodeUri = webview.asWebviewUri(
      vscode.Uri.joinPath(
        this._context.extensionUri,
        'src',
        'webview-dist',
        'CloudSideBarView',
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
            
            <!--meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource} blob:; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';"-->
            <meta http-equiv="Content-Security-Policy" content="default-src *; img-src ${webview.cspSource} http: https:;
              script-src ${webview.cspSource}; 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'unsafe-inline' http: https: data: *;">
            
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            
            <link href="${styleVSCodeUri}" rel="stylesheet" />
            
            <title>Scribe Audio Navigation</title>
        </head>
        <body>
            <div id="root"></div>
            <script nonce="${nonce}" src="${scriptUri}"></script>
        </body>
        </html>
    `;
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
}

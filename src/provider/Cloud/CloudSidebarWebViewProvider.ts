import * as vscode from 'vscode';
import { getNonce } from '../../utils/getNonce';
import axios from 'axios';
import {
  CloudProviderToWebMsgTypes,
  CloudUIToExtMsg,
  CloudWebToProviderMsgTypes,
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

  constructor(private readonly context: vscode.ExtensionContext) {
    this._context = context;
    this.globalState = context.workspaceState;
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

    console.log('in render webview');
    webviewPanel.webview.html = this.getHtmlForWebview(webviewPanel.webview);
    console.log('After Html Render');

    /**
     * Handle recieve message from webview
     */
    webviewPanel.webview.onDidReceiveMessage(
      async (e: {
        type: CloudWebToProviderMsgTypes;
        data: CloudUIToExtMsg;
      }) => {
        switch (e.type) {
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
                this.storeSecret(
                  storageKeys.cloudUserToken,
                  JSON.stringify(tokenData),
                );
              }
            } catch (error) {
              console.log('errr : ', error?.message);
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
  private storeSecret(key: string, value: string) {
    this.context.secrets.store(key, value);
  }

  /**
   * get secrets
   */
  private getSecret(key: string, value: string) {
    this.context.secrets.get(key);
  }

  /**
   * delete secrets
   */
  private removeSecret(key: string, value: string) {
    this.context.secrets.delete(key);
  }
}

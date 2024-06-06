// import { VSCodeButton } from '@vscode/webview-ui-toolkit/react';
import React, { useEffect, useState } from 'react';
import Login from './Components/Login/Login';
import Repo from './Components/Repo/Repo';
import {
  CloudProviderToWebMsgTypes,
  CloudWebToProviderMsgTypes,
} from '../../../../types/cloud';
import { vscode } from '../provider/vscodewebprovider';

function App() {
  const [authenticated, setAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // listen for vscode.postmessage event from extension to webview here
    vscode.postMessage({
      type: CloudWebToProviderMsgTypes.CheckToken,
      data: null,
    });

    const handleExtensionPostMessages = (event: MessageEvent) => {
      const { type, data } = event.data;
      switch (type) {
        case CloudProviderToWebMsgTypes.LoginResponse: {
          // Login response success or failure
          console.log('response of login in UI ======== : ', data);
          if (data?.loggedIn) {
            setAuthenticated(true);
          } else {
            setAuthenticated(false);
          }
          break;
        }

        default:
          break;
      }
    };

    // add listener for the event
    window.addEventListener('message', handleExtensionPostMessages);

    return () => {
      // clean up event listener
      window.removeEventListener('message', handleExtensionPostMessages);
    };
  }, []);

  return <div className="my-2 p-2">{authenticated ? <Repo /> : <Login />}</div>;
}

export default App;

import {
  VSCodeButton,
  VSCodeTextField,
  VsCode,
} from '@vscode/webview-ui-toolkit/react';
import React, { useEffect, useState } from 'react';
import {
  CloudWebToProviderMsgTypes,
  CloudProviderToWebMsgTypes,
  CloudExtToUIMsg,
} from '../../../../../../types/cloud';
import { vscode } from '../../../provider/vscodewebprovider';

function Login() {
  const [accessKey, setAccessKey] = useState('');
  const [secretKey, setSecretKey] = useState('');

  const handleLogin = async () => {
    console.log('login : ', { accessKey, secretKey });

    vscode.postMessage({
      type: CloudWebToProviderMsgTypes.RequestToLogin,
      data: {
        access_key_id: accessKey,
        secret_access_key: secretKey,
      },
    });
  };

  useEffect(() => {
    const handleExtensionPostMessages = (event: MessageEvent) => {
      const { type, data } = event.data as CloudExtToUIMsg;
      switch (type) {
        // case CloudProviderToWebMsgTypes.LoginResponse: {
        //   // Login response success or failure
        //   console.log('response of login in UI ======== : ', data);
        //   if (data.data?.token) {
        //     setAuthenticated(true);
        //   } else {
        //     setAuthenticated(false);
        //   }
        //   break;
        // }

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

  return (
    <div className="flex flex-col gap-5">
      <VSCodeTextField
        className=""
        value={accessKey}
        placeholder="access key"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setAccessKey(e.target.value)
        }
      >
        Access Key
      </VSCodeTextField>
      <VSCodeTextField
        className=""
        value={secretKey}
        placeholder="secret key"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setSecretKey(e.target.value)
        }
      >
        Secret Key
      </VSCodeTextField>

      <VSCodeButton className="" onClick={handleLogin}>
        Login
      </VSCodeButton>
    </div>
  );
}

export default Login;

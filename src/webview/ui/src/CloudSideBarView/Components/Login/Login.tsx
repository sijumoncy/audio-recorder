import {
  VSCodeButton,
  VSCodeTextField,
  VsCode,
} from '@vscode/webview-ui-toolkit/react';
import React, { useState } from 'react';

function Login() {
  const [accessKey, setAccessKey] = useState('');
  const [secretKey, setSecretKey] = useState('');

  const handleLogin = async () => {
    console.log('login : ', { accessKey, secretKey });
  };

  return (
    <div className="flex flex-col gap-5">
      <VSCodeTextField
        className=""
        value={accessKey}
        placeholder="access key"
        onChange={(e) => setAccessKey(e.target.value)}
      >
        Access Key
      </VSCodeTextField>
      <VSCodeTextField
        className=""
        value={secretKey}
        placeholder="secret key"
        onChange={(e) => setSecretKey(e.target.value)}
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

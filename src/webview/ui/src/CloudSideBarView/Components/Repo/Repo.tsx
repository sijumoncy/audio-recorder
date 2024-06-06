import React from 'react';
import { vscode } from '../../../provider/vscodewebprovider';
import { VSCodeButton } from '@vscode/webview-ui-toolkit/react';
import { CloudWebToProviderMsgTypes } from '../../../../../../types/cloud';
import ProjectsList from '../Projects/ProjectsList';

function Repo() {
  const handleLogout = () => {
    vscode.postMessage({
      type: CloudWebToProviderMsgTypes.Logout,
      data: null,
    });
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="w-full flex justify-end px-2">
        <VSCodeButton className="" onClick={handleLogout}>
          Logout
        </VSCodeButton>
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="font-medium text-sm">Projects</h3>
        <ProjectsList />
      </div>
    </div>
  );
}

export default Repo;

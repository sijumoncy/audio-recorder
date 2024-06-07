// import { VSCodeButton } from '@vscode/webview-ui-toolkit/react';
import React, { useEffect, useState } from 'react';
import {
  CloudPanelProviderToWebMsgTypes,
  CloudWebPanelToProviderMsgTypes,
  IRepo,
  IReponseListFiles,
} from '../../../../types/cloud';
import { vscode } from '../provider/vscodewebprovider';
import ProjectDetails from './components/ProjectDetails';

function App() {
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [repoData, setRepoData] = useState<{
    repoBase: IRepo;
    file: IReponseListFiles;
  } | null>(null);

  useEffect(() => {
    // listen for vscode.postmessage event from extension to webview here
    vscode.postMessage({
      type: CloudWebPanelToProviderMsgTypes.CheckAuthAndRepoData,
      data: null,
    });

    const handleExtensionPostMessages = (event: MessageEvent) => {
      const { type, data } = event.data;
      switch (type) {
        case CloudPanelProviderToWebMsgTypes.AuthRepoResponse: {
          setAuthenticated(data?.loggedIn);
          setRepoData(data?.data);
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

  console.log('repos **************** ', { repoData });

  return (
    <div className="my-2">
      {authenticated ? (
        <>
          {!repoData?.repoBase?.id && (
            <div className="text-red-500">Unable to get Project Details</div>
          )}
          <ProjectDetails repodata={repoData} />
        </>
      ) : (
        <div>You are not loggedIn. Please Login to Ccontinue</div>
      )}
    </div>
  );
}

export default App;

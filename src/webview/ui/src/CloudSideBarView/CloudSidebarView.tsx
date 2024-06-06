// import { VSCodeButton } from '@vscode/webview-ui-toolkit/react';
import React, { useEffect } from 'react';
// import { vscode } from '../provider/vscodewebprovider';

function App() {
  useEffect(() => {
    // listen for vscode.postmessage event from extension to webview here
    // vscode.postMessage({
    //   type: NavWebToExtMsgTypes.FetchVersification,
    //   data: null,
    // });

    const handleExtensionPostMessages = (event: MessageEvent) => {
      const { type, data } = event.data;
      switch (type) {
        case '': {
          // processed vesification data from workspace dir
          console.log('data ', data);

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

  return (
    <div className="bg-red-500">
      <div>View Cloud</div>
    </div>
  );
}

export default App;

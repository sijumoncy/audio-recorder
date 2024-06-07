import React, { useEffect, useState } from 'react';
import {
  CloudPanelProviderToWebMsgTypes,
  CloudWebPanelToProviderMsgTypes,
  IPathCommitResponse,
  IRepo,
  IReponseListFiles,
} from '../../../../../types/cloud';
import { vscode } from '../../provider/vscodewebprovider';
import { VSCodeBadge } from '@vscode/webview-ui-toolkit/react';

interface IProjectDetails {
  repodata: {
    repoBase: IRepo;
    file: IReponseListFiles;
  } | null;
}
// { repoBase: selectedRepo, file: repoFiles }
function ProjectDetails({ repodata }: IProjectDetails) {
  const [pathVersions, setPathVersions] = useState<IPathCommitResponse[] | []>(
    [],
  );
  const [path, setPath] = useState<string | null>(null);
  const [audioLink, setAudioLink] = useState<string | null>(null);

  const creationDate = React.useMemo(() => {
    if (repodata?.repoBase?.creation_date) {
      const _date = new Date(repodata.repoBase.creation_date);
      return _date.toString();
    }
    return '';
  }, [repodata?.repoBase.creation_date]);

  const handleGetVersions = async (path: string, repoData: IRepo) => {
    setPath(path);
    vscode.postMessage({
      type: CloudWebPanelToProviderMsgTypes.getPathVersion,
      data: { path: path, repo: repoData },
    });
  };

  const handleGetAudio = (commitId: string) => {
    vscode.postMessage({
      type: CloudWebPanelToProviderMsgTypes.getAudioWithCOmmitId,
      data: { commitId: commitId, path: path },
    });
  };

  useEffect(() => {
    // listen for vscode.postmessage event from extension to webview here

    const handleExtensionPostMessages = (event: MessageEvent) => {
      const { type, data } = event.data;
      switch (type) {
        case CloudPanelProviderToWebMsgTypes.pathVersionResponse: {
          console.log('path version data =1112222233333==> ', data);
          setPathVersions(data?.results || []);
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
    <div>
      <div className="flex px-2 justify-between my-2">
        <p>{repodata?.repoBase?.id}</p>
        <p>{creationDate}</p>
        <p>{repodata?.repoBase.default_branch}</p>
      </div>

      {/* File List and version*/}
      <div className="grid grid-cols-2 mt-5">
        <div className="flex flex-col items-start gap-3">
          {repodata?.file?.results?.map((file) => (
            <button
              className=""
              onClick={() => handleGetVersions(file.path, repodata.repoBase)}
            >
              {file.path}
            </button>
          ))}
        </div>

        {/* versions list */}
        <div className="flex flex-col gap-5">
          {pathVersions?.map((version, index) => {
            const _created = new Date(version.creation_date);
            const createdDate = _created.toString();
            return (
              <div
                className="flex gap-2"
                onClick={() => handleGetAudio(version.id)}
              >
                <VSCodeBadge>{index + 1}</VSCodeBadge>
                <div className="flex flex-col gap-1">
                  <p>{version.id}</p>
                  <p>{createdDate}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {audioLink && <audio src={audioLink} controls muted />}
    </div>
  );
}

export default ProjectDetails;

import React, { useEffect, useState } from 'react';
import { vscode } from '../../../provider/vscodewebprovider';
import {
  CloudProviderToWebMsgTypes,
  CloudWebToProviderMsgTypes,
  IRepo,
} from '../../../../../../types/cloud';
import Git from '../../../IconsComponents/Git';

function ProjectsList() {
  const [projects, setProjects] = useState<IRepo[] | []>([]);
  // const [loading, setloading] = useState(false);

  useEffect(() => {
    vscode.postMessage({
      type: CloudWebToProviderMsgTypes.FetchProjects,
      data: null,
    });

    const handleExtensionPostMessages = (event: MessageEvent) => {
      const { type, data } = event.data;
      switch (type) {
        case CloudProviderToWebMsgTypes.ProjectsList: {
          // Project data - All or current active
          console.log('Project data UI ===> ', data);
          setProjects(data);
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

  const handleSelectProject = (id: string) => {
    vscode.postMessage({
      type: CloudWebToProviderMsgTypes.selectProject,
      data: id,
    });
  };

  console.log({ projects });

  return (
    <div className="flex flex-col gap-2">
      {projects.map((project) => (
        <div className="flex gap-2">
          <div>
            <Git classes={`w-5 h-5`} />
          </div>
          <span
            className="cursor-pointer hover:underline"
            onClick={() => handleSelectProject(project.id)}
          >
            {project.id}
          </span>
        </div>
      ))}
    </div>
  );
}

export default ProjectsList;

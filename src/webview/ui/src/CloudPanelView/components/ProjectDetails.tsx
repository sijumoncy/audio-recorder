import React from 'react';
import { IRepo, IReponseListFiles } from '../../../../../types/cloud';

interface IProjectDetails {
  repodata: {
    repoBase: IRepo;
    file: IReponseListFiles;
  } | null;
}
// { repoBase: selectedRepo, file: repoFiles }
function ProjectDetails({ repodata }: IProjectDetails) {
  const creationDate = React.useMemo(() => {
    if (repodata?.repoBase?.creation_date) {
      const _date = new Date(repodata.repoBase.creation_date);
      return _date.toString();
    }
    return '';
  }, [repodata?.repoBase.creation_date]);

  return (
    <div>
      <div className="flex px-2 justify-between my-2">
        <p>{repodata?.repoBase?.id}</p>
        <p>{creationDate}</p>
        <p>{repodata?.repoBase.default_branch}</p>
      </div>

      {/* File List */}
      <div className="flex flex-col items-start gap-3 mt-5">
        {repodata?.file?.results?.map((file) => (
          <button className="">{file.path}</button>
        ))}
      </div>
    </div>
  );
}

export default ProjectDetails;

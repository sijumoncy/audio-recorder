import axios, { AxiosError } from 'axios';
import { IAudioBurrito } from '../../../types/audio';
import { environment } from '../../../environment';
import { IRepo, IToken } from '../../../types/cloud';

/**
 *
 * @param metadata
 * Handle Sync Project to cloud
 */
export async function projectSync(metadata: IAudioBurrito, token: IToken) {
  console.log('in project sync ', metadata);

  // get project name with id
  const projectName = metadata.identification.name.en;
  const projectIdObj = metadata.identification.primary['scribe'];
  const projectId = Object.keys(projectIdObj)[0];
  const projectFullName = `${projectName}_${projectId}`;
  let newProject = false;
  let existingRepoData: IRepo | null = null;
  console.log('Project Name >>>> : ', projectFullName);

  // check the project already exist or new project
  try {
    const getRepoResponse = await axios.get(
      `${environment.BASE_CLOUD_URL}/repositories/${projectFullName}`,
      { headers: { Authorization: `Bearer ${token.token}` } },
    );

    // Existing Project
    newProject = false;
    existingRepoData = getRepoResponse.data as IRepo;
  } catch (err: any) {
    if (axios.isAxiosError(err)) {
      if (err.response?.status === 404) {
        // not found error
        // New Project
        newProject = true;
      } else {
        throw new Error(err.message);
      }
    } else {
      // unknown error
      console.log('erros project check ======> ', err);
      throw new Error(err?.message);
    }
  }

  console.log('NEW PROJECT CHECK ====> ', newProject, existingRepoData);

  if (newProject) {
    // NEw Project ?
    // create new repo - main branch or any specific branch as default
  } else {
    //upload data to project and commit as new version - for NEW and Existing Projects
  }
}

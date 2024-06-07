import axios, { AxiosError } from 'axios';
import { IAudioBurrito } from '../../../types/audio';
import { environment } from '../../../environment';
import { IRepo, IToken } from '../../../types/cloud';
import { getRepo } from './cloudUtils';

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
  // TODO : The repo name only Allows  :  Min 3 characters. Only lowercase alphanumeric characters and '-' allowed.
  const projectFullName = `${projectName}-${projectId}`;
  console.log('Project Name >>>> : ', projectFullName);

  // check the project already exist or new project
  const repoData = await getRepo(token.token, projectFullName);
  if (repoData) {
    // exiting Project
    console.log('Existing Project ===> ', repoData.id);
  } else {
    // new project
    console.log('New Project ******* ');
  }
}

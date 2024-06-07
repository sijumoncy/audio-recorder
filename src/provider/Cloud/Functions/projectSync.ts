import axios, { AxiosError } from 'axios';
import { IAudioBurrito } from '../../../types/audio';
import { environment } from '../../../environment';
import { IRepo, IToken } from '../../../types/cloud';
import { createRepo, getRepo } from './cloudUtils';

/**
 *
 * @param metadata
 * Handle Sync Project to cloud
 */
export async function projectSync(metadata: IAudioBurrito, token: IToken) {
  console.log('in project sync ', metadata);

  // Check and init git in local for the project
  // INFO: As of now , no git init on project creation. only check on first sync

  // get project name with id
  const projectName = metadata.identification.name.en;
  const projectIdObj = metadata.identification.primary['scribe'];
  const projectId = Object.keys(projectIdObj)[0];
  // TODO : The repo name only Allows  :  Min 3 characters. Only lowercase alphanumeric characters and '-' allowed.
  const projectFullName = `${projectName}-${projectId}`;
  console.log('Project Name >>>> : ', projectFullName);

  // check the project already exist or new project
  let repoData = await getRepo(token.token, projectFullName);
  if (!repoData) {
    // new project
    console.log('New Project ******* ');
    repoData = await createRepo(
      projectFullName,
      token.token,
      environment.S3_BUCKET_NAME,
    );
    console.log('New Project Created &&&&&&&  ', repoData);
  }
  // exiting Project or created
  if (repoData) {
    console.log('Existing Project ===> ', repoData.id);
    // upload data to cloud
  }
}

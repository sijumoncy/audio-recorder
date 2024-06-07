/**
 * Cloud Util functions
 */

import axios from 'axios';
import { IRepo, IToken } from '../../../types/cloud';
import { environment } from '../../../environment';

/**
 *
 * @param token
 * @param repoName
 * @returns
 * Get repo details or return null / error
 */
export async function getRepo(
  token: string,
  repoName: string,
): Promise<IRepo | undefined> {
  try {
    console.log('in function call', repoName);

    const response = await axios.get(
      `${environment.BASE_CLOUD_URL}/repositories/${repoName}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    return response.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.log('Erororr )))))))))) ', err);

      if (err.response?.status === 404) {
        // not found repo
        return undefined;
      } else {
        throw new Error(err.message);
      }
    }
  }
}

export async function createRepo() {}

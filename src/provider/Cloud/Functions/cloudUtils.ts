/**
 * Cloud Util functions
 */

import axios from 'axios';
import { IObjectUploadAPIResponse, IRepo, IToken } from '../../../types/cloud';
import { environment } from '../../../environment';
import { BinaryLike } from 'crypto';

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
  } catch (err: any) {
    if (axios.isAxiosError(err)) {
      console.log('Erororr )))))))))) ', err);

      if (err.response?.status === 404) {
        // not found repo
        return undefined;
      } else {
        throw new Error(err.message);
      }
    }
    throw new Error(err);
  }
}

/**
 * Create a new repository
 */
export async function createRepo(
  repoName: string,
  token: string,
  s3BucketName: string,
  default_branch: string = 'main',
  readOnly: boolean = false,
): Promise<IRepo | undefined> {
  try {
    const data = {
      name: repoName,
      storage_namespace: `s3://${s3BucketName}/${repoName}`, // INFO : Each Repo Need new storage bucket, or use name space ( we are using repo name )
      default_branch: default_branch,
      sample_data: false,
      read_only: readOnly,
    };
    const response = await axios.post(
      `${environment.BASE_CLOUD_URL}/repositories`,
      data,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    return response.data as IRepo;
  } catch (err: any) {
    if (axios.isAxiosError(err)) {
      console.log('Erororr )))))))))) ', err);
      throw new Error(err.response?.data?.message || err.message);
    }
    throw new Error(err.message);
  }
}

/**
 *
 * @param params
 * Function to upload single binary object
 */
export async function uploadObject(
  token: string,
  repoName: string,
  branch: string,
  path: string,
  data: BinaryLike,
) {
  try {
    const response = await axios.post(
      `${environment.BASE_CLOUD_URL}/repositories/${repoName}/branches/${branch}/objects?path=${path}`,
      data,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    return response.data as IObjectUploadAPIResponse;
  } catch (err: any) {
    if (axios.isAxiosError(err)) {
      console.log(`Erororr ))))))))))  ${path} : `, err);
      return { error: true, data: err.response?.data };
    }
    console.log('Upload Object Error');
    return { error: true, data: null };
  }
}

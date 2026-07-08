import StorageConstants from '../constants/StorageConstants';
import LocalStorageService from './LocalStorageService';
import LoaderService from './LoaderService';

export const getBaseApiUrl = () =>
  process.env.REACT_APP_ENV === 'dev'
    ? process.env.REACT_APP_API_URL_LOCAL
    : process.env.REACT_APP_API_URL;

export default {
  fetchApi(apiEndpoint, method, requestPayload) {
    const user = LocalStorageService.getItem(StorageConstants.USER);
    const token = user?.token;
    let headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    if (token) headers.Authorization = `Bearer ${token}`;

    const url = `${getBaseApiUrl()}${apiEndpoint}`;

    LoaderService.start();
    return fetch(url, {
      method,
      headers,
      ...(requestPayload && { body: JSON.stringify(requestPayload) }),
    }).finally(() => LoaderService.stop());
  },
};

import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';

// axios.defaults.baseURL = 'http://localhost:3010/api/';

axios.defaults.baseURL =
  'https://back-inventory-production.up.railway.app/api/';

class APIClient {
  /**
   * Fetches data from the given URL
   */
  get = (url: string, params?: any): Promise<AxiosResponse> => {
    let response: Promise<AxiosResponse>;

    let paramKeys: string[] = [];

    if (params) {
      Object.keys(params).map((key) => {
        paramKeys.push(key + '=' + params[key]);
        return paramKeys;
      });

      const queryString =
        paramKeys && paramKeys.length ? paramKeys.join('&') : '';
      response = axios.get(`${url}?${queryString}`, params);
    } else {
      response = axios.get(`${url}`, params);
    }

    return response;
  };

  /**
   * Posts the given data to the URL
   */
  create = (
    url: string,
    data: any,
    contentType: string = 'application/json',
  ): Promise<AxiosResponse> => {
    return axios.post(url, data, { headers: { 'Content-Type': contentType } });
  };

  /**
   * Updates data
   */
  update = (url: string, data: any): Promise<AxiosResponse> => {
    return axios.patch(url, data);
  };

  put = (
    url: string,
    data: any,
    contentType: string = 'application/json',
  ): Promise<AxiosResponse> => {
    return axios.put(url, data, { headers: { 'Content-Type': contentType } });
  };

  /**
   * Deletes data
   */
  delete = (
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse> => {
    return axios.delete(url, { ...config });
  };
}

const getUserLogged = () => {
  const user = sessionStorage.getItem('authUser');
  if (!user) {
    return null;
  } else {
    return JSON.parse(user);
  }
};

export { APIClient, getUserLogged };

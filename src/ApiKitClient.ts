import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { HttpMethod, ApiClientResponse, PaginatedResponse } from './types';

export function ApiKitClient<T>(
  baseUrl: string,
  authToken?: string,
  handleUnauthorizedAccess?: () => void
) {
  const axiosInstance = axios.create({
    baseURL: baseUrl,
    headers: {
      ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {}),
    },
  });

  axiosInstance.interceptors.response.use(response => response, (error: AxiosError) => {
    if (error.response?.status === 401 && handleUnauthorizedAccess) {
      handleUnauthorizedAccess();
    }
    return Promise.reject(error);
  });

  const request = async <R = T>(
    method: HttpMethod,
    endpoint: string,
    body?: T,
    params?: URLSearchParams
  ): Promise<ApiClientResponse<R>> => {
    const config: AxiosRequestConfig = {
      url: endpoint,
      method,
      data: body,
      params,
    };

    try {
      const response = await axiosInstance.request(config);
      return { status: response.status, data: response.data };
    } catch (error) {
      const axiosError = error as AxiosError | any;
      return {
        status: axiosError.response?.status || 500,
        errors: axiosError.response?.data.errors,
      };
    }
  };

  return {
    get: (endpoint: string, params?: URLSearchParams) => request<PaginatedResponse<T[]>>(HttpMethod.GET, endpoint, undefined, params),
    getOne: (endpoint: string, params?: URLSearchParams) => request<T>(HttpMethod.GET, endpoint, undefined, params),
    post: (endpoint: string, body: T) => request<T>(HttpMethod.POST, endpoint, body),
    put: (endpoint: string, body: T) => request<T>(HttpMethod.PUT, endpoint, body),
    patch: (endpoint: string, body: T) => request<T>(HttpMethod.PATCH, endpoint, body),
    delete: (endpoint: string) => request<T>(HttpMethod.DELETE, endpoint),
  };
}

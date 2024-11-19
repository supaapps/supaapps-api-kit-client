import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { PaginatedResponse } from './types';

type UnAuthorizedCallback = () => void;
type AuthTokenCallback = () => Promise<string>;
type ApiClient = {
    baseURL: string;
    authTokenCallback?: AuthTokenCallback;
    unauthorizedCallback?: UnAuthorizedCallback;
    useAuth: boolean;
    axiosInstance: AxiosInstance;
};


export class ApiKitClient {
  private apiClientKey: string;
  public static apiClients: Record<string, ApiClient> = {};

  public static i(configInstance: string): ApiKitClient {
    return new ApiKitClient(configInstance);
  }

    private constructor(apiClientKey: string = 'default') {
        this.apiClientKey = apiClientKey;
    }


    public initialize(baseURL: string, authTokenCallback?: AuthTokenCallback, unauthorizedCallback?: UnAuthorizedCallback, useAuth: boolean = false): void {
        if (useAuth && !authTokenCallback) {
            throw new Error("authTokenCallback must be provided if useAuth is true.");
        }

        ApiKitClient.apiClients[this.apiClientKey] = {
            baseURL,
            authTokenCallback,
            unauthorizedCallback: unauthorizedCallback,
            useAuth,
            axiosInstance: axios.create({ baseURL }),
        };
      (new ApiKitClient(this.apiClientKey)).setupInterceptors();

    }



  private setupInterceptors(): void {
    const apiClient = ApiKitClient.apiClients[this.apiClientKey];
    apiClient.axiosInstance.interceptors.request.use(async (config) => {
      if (apiClient.useAuth && apiClient.authTokenCallback) {
        const authToken = await apiClient.authTokenCallback();
        config.headers.Authorization = `Bearer ${authToken}`;
      }
      return config;
    });

    apiClient.axiosInstance.interceptors.response.use((response: AxiosResponse) => response, (error: AxiosError) => {
      if (error.response?.status === 401 && apiClient.unauthorizedCallback) {
        apiClient.unauthorizedCallback();
      }
      return Promise.reject(error);
    });
  }

  private checkInitialization(): void {
    if (!ApiKitClient.apiClients[this.apiClientKey]) {
      throw new Error(`ApiKitClient has not been initialized for '${this.apiClientKey}' apiClientKey . Please call ApiKitClient.i('${this.apiClientKey}').initialize() before making requests.`);
    }
  }

  private static checkInitialization(): void {
    if (!this.apiClients.default) {
      throw new Error("ApiKitClient has not been initialized. Please call ApiKitClient.initialize() before making requests.");
    }
  }


  public async get<T>(endpoint: string, params?: URLSearchParams): Promise<AxiosResponse<T>> {
    this.checkInitialization();
    const axiosInstance = ApiKitClient.apiClients[this.apiClientKey].axiosInstance;
    return axiosInstance!.get<T>(endpoint, { params });
  }

  public async getOne<T>(endpoint: string, params?: URLSearchParams): Promise<AxiosResponse<T>> {
    this.checkInitialization();
    const axiosInstance = ApiKitClient.apiClients[this.apiClientKey].axiosInstance;
    return axiosInstance!.get<T>(endpoint, { params });
  }

  public async getPaginated<T>(endpoint: string, params?: URLSearchParams): Promise<AxiosResponse<PaginatedResponse<T>>> {
    this.checkInitialization();
    const axiosInstance = ApiKitClient.apiClients[this.apiClientKey].axiosInstance;
    return axiosInstance!.get<PaginatedResponse<T>>(endpoint, { params });
  }

  public async post<T>(endpoint: string, data?: T): Promise<AxiosResponse<T>> {
    this.checkInitialization();
    const axiosInstance = ApiKitClient.apiClients[this.apiClientKey].axiosInstance;
    return axiosInstance!.post<T>(endpoint, data);
  }

  public async put<T>(endpoint: string, data: Partial<T>): Promise<AxiosResponse<T>> {
    this.checkInitialization();
    const axiosInstance = ApiKitClient.apiClients[this.apiClientKey].axiosInstance;
    return axiosInstance!.put<T>(endpoint, data);
  }

  public async patch<T>(endpoint: string, data: Partial<T>): Promise<AxiosResponse<T>> {
    this.checkInitialization();
    const axiosInstance = ApiKitClient.apiClients[this.apiClientKey].axiosInstance;
    return axiosInstance!.patch<T>(endpoint, data);
  }

  public async delete<T>(endpoint: string): Promise<AxiosResponse<T>> {
    this.checkInitialization();
    const axiosInstance = ApiKitClient.apiClients[this.apiClientKey].axiosInstance;
    return axiosInstance!.delete<T>(endpoint);
  }


  // backward compatible methods

  public static initialize(baseURL: string, authTokenCallback?: AuthTokenCallback, unauthorizedCallback?: UnAuthorizedCallback, useAuth: boolean = false): void {
    new ApiKitClient('default').initialize(baseURL, authTokenCallback, unauthorizedCallback, useAuth);
  }

  public static async get<T>(endpoint: string, params?: URLSearchParams): Promise<AxiosResponse<T>> {
    return (new ApiKitClient('default')).get<T>(endpoint, params);
  }

  public static async getOne<T>(endpoint: string, params?: URLSearchParams): Promise<AxiosResponse<T>> {
    return (new ApiKitClient('default')).getOne<T>(endpoint, params);
  }

  public static async getPaginated<T>(endpoint: string, params?: URLSearchParams): Promise<AxiosResponse<PaginatedResponse<T>>> {
    return (new ApiKitClient('default')).getPaginated<T>(endpoint, params);
  }

  public static async post<T>(endpoint: string, data?: T): Promise<AxiosResponse<T>> {
    return (new ApiKitClient('default')).post<T>(endpoint, data);
  }

  public static async put<T>(endpoint: string, data: Partial<T>): Promise<AxiosResponse<T>> {
    return (new ApiKitClient('default')).put<T>(endpoint, data);
  }

  public static async patch<T>(endpoint: string, data: Partial<T>): Promise<AxiosResponse<T>> {
    return (new ApiKitClient('default')).patch<T>(endpoint, data);
  }

  public static async delete<T>(endpoint: string): Promise<AxiosResponse<T>> {
    return (new ApiKitClient('default')).delete<T>(endpoint);
  }
}

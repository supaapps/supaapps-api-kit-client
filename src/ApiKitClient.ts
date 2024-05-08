import axios, { AxiosInstance, AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';
import { PaginatedResponse } from './types';

type UnauthorizationCallback = () => void;
type AuthTokenCallback = () => Promise<string>;

export class ApiKitClient {
  private static instance: AxiosInstance;
  private static authTokenCallback: AuthTokenCallback;
  private static unauthorizationCallback: UnauthorizationCallback;

  public static initialize(baseURL: string, authTokenCallback: AuthTokenCallback, unauthorizationCallback?: UnauthorizationCallback): void {
    this.authTokenCallback = authTokenCallback;
    this.unauthorizationCallback = unauthorizationCallback;

    this.instance = axios.create({ baseURL });

    this.setupInterceptors();
  }

  private static setupInterceptors(): void {
    this.instance.interceptors.request.use(async (config) => {
      if (this.authTokenCallback) {
        const authToken = await this.authTokenCallback();
        config.headers.Authorization = `Bearer ${authToken}`;
      }
      return config;
    });

    this.instance.interceptors.response.use((response: AxiosResponse) => response, (error: AxiosError) => {
      if (error.response?.status === 401 && this.unauthorizationCallback) {
        this.unauthorizationCallback();
      }
      return Promise.reject(error);
    });
  }

  private static checkInitialization(): void {
    if (!this.instance) {
      throw new Error("ApiKitClient has not been initialized. Please call ApiKitClient.initialize() before making requests.");
    }
  }

  private static createConfig(options?: { responseType?: AxiosRequestConfig['responseType'], params?: URLSearchParams }): AxiosRequestConfig {
    return {
      responseType: options?.responseType,
      params: options?.params
    };
  }

  public static async get<T>(endpoint: string, options?: { params?: URLSearchParams, responseType?: AxiosRequestConfig['responseType'] }): Promise<AxiosResponse<T>> {
    this.checkInitialization();
    const config = this.createConfig(options);
    return this.instance!.get<T>(endpoint, config);
  }

  public static async getOne<T>(endpoint: string, options?: { params?: URLSearchParams, responseType?: AxiosRequestConfig['responseType'] }): Promise<AxiosResponse<T>> {
    this.checkInitialization();
    const config = this.createConfig(options);
    return this.instance!.get<T>(endpoint, config);
  }

  public static async getPaginated<T>(endpoint: string, options?: { params?: URLSearchParams, responseType?: AxiosRequestConfig['responseType'] }): Promise<AxiosResponse<PaginatedResponse<T>>> {
    this.checkInitialization();
    const config = this.createConfig(options);
    return this.instance!.get<PaginatedResponse<T>>(endpoint, config);
  }

  public static async post<T>(endpoint: string, data: T, options?: { responseType?: AxiosRequestConfig['responseType'] }): Promise<AxiosResponse<T>> {
    this.checkInitialization();
    const config = this.createConfig(options);
    return this.instance!.post<T>(endpoint, data, config);
  }

  public static async put<T>(endpoint: string, data: T, options?: { responseType?: AxiosRequestConfig['responseType'] }): Promise<AxiosResponse<T>> {
    this.checkInitialization();
    const config = this.createConfig(options);
    return this.instance!.put<T>(endpoint, data, config);
  }

  public static async patch<T>(endpoint: string, data: T, options?: { responseType?: AxiosRequestConfig['responseType'] }): Promise<AxiosResponse<T>> {
    this.checkInitialization();
    const config = this.createConfig(options);
    return this.instance!.patch<T>(endpoint, data, config);
  }

  public static async delete<T>(endpoint: string, options?: { responseType?: AxiosRequestConfig['responseType'] }): Promise<AxiosResponse<T>> {
    this.checkInitialization();
    const config = this.createConfig(options);
    return this.instance!.delete<T>(endpoint, config);
  }
}

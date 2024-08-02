import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
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

  public static async get<T>(endpoint: string, params?: URLSearchParams): Promise<AxiosResponse<T>> {
    this.checkInitialization();
    return this.instance!.get<T>(endpoint, { params });
  }

  public static async getOne<T>(endpoint: string, params?: URLSearchParams): Promise<AxiosResponse<T>> {
    this.checkInitialization();
    return this.instance!.get<T>(endpoint, { params });
  }

  public static async getPaginated<T>(endpoint: string, params?: URLSearchParams): Promise<AxiosResponse<PaginatedResponse<T>>> {
    this.checkInitialization();
    return this.instance!.get<PaginatedResponse<T>>(endpoint, { params });
  }

  public static async post<T>(endpoint: string, data: T): Promise<AxiosResponse<T>> {
    this.checkInitialization();
    return this.instance!.post<T>(endpoint, data);
  }

  public static async put<T>(endpoint: string, data: Partial<T>): Promise<AxiosResponse<T>> {
    this.checkInitialization();
    return this.instance!.put<T>(endpoint, data);
  }

  public static async patch<T>(endpoint: string, data: Partial<T>): Promise<AxiosResponse<T>> {
    this.checkInitialization();
    return this.instance!.patch<T>(endpoint, data);
  }

  public static async delete<T>(endpoint: string): Promise<AxiosResponse<T>> {
    this.checkInitialization();
    return this.instance!.delete<T>(endpoint);
  }
}

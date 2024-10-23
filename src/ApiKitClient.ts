import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";
import { PaginatedResponse } from "./types";

type UnauthorizationCallback = () => void;
type AuthTokenCallback = () => Promise<string>;

export class ApiKitClient {
  private static instances: Map<string, ApiKitClient> = new Map();
  private instance: AxiosInstance;
  private authTokenCallback?: AuthTokenCallback;
  private unauthorizationCallback?: UnauthorizationCallback;
  private useAuth: boolean = false;

  private constructor(
    baseURL: string,
    authTokenCallback?: AuthTokenCallback,
    unauthorizationCallback?: UnauthorizationCallback,
    useAuth: boolean = false
  ) {
    if (useAuth && !authTokenCallback) {
      throw new Error("authTokenCallback must be provided if useAuth is true.");
    }

    this.authTokenCallback = authTokenCallback;
    this.unauthorizationCallback = unauthorizationCallback;
    this.useAuth = useAuth;

    this.instance = axios.create({ baseURL });

    this.setupInterceptors();
  }

  public static initialize(
    instanceKey: string,
    baseURL: string,
    authTokenCallback?: AuthTokenCallback,
    unauthorizationCallback?: UnauthorizationCallback,
    useAuth: boolean = false
  ): void {
    const client = new ApiKitClient(
      baseURL,
      authTokenCallback,
      unauthorizationCallback,
      useAuth
    );
    this.instances.set(instanceKey, client);
  }

  public static getInstanceByKey(instanceKey: string): ApiKitClient {
    const client = this.instances.get(instanceKey);
    if (!client) {
      throw new Error(
        `ApiKitClient instance with key "${instanceKey}" has not been initialized.`
      );
    }
    return client;
  }

  private setupInterceptors(): void {
    this.instance.interceptors.request.use(async (config) => {
      if (this.useAuth && this.authTokenCallback) {
        const authToken = await this.authTokenCallback();
        if (authToken) {
          config.headers.Authorization = `Bearer ${authToken}`;
        }
      }
      return config;
    });

    this.instance.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401 && this.unauthorizationCallback) {
          this.unauthorizationCallback();
        }
        return Promise.reject(error);
      }
    );
  }

  private checkInitialization(): void {
    if (!this.instance) {
      throw new Error(
        "ApiKitClient has not been initialized. Please call ApiKitClient.initialize() before making requests."
      );
    }
  }

  public async get<T>(
    endpoint: string,
    params?: URLSearchParams
  ): Promise<AxiosResponse<T>> {
    this.checkInitialization();
    return this.instance.get<T>(endpoint, { params });
  }

  public async getOne<T>(
    endpoint: string,
    params?: URLSearchParams
  ): Promise<AxiosResponse<T>> {
    this.checkInitialization();
    return this.instance.get<T>(endpoint, { params });
  }

  public async getPaginated<T>(
    endpoint: string,
    params?: URLSearchParams
  ): Promise<AxiosResponse<PaginatedResponse<T>>> {
    this.checkInitialization();
    return this.instance.get<PaginatedResponse<T>>(endpoint, { params });
  }

  public async post<T>(endpoint: string, data?: T): Promise<AxiosResponse<T>> {
    this.checkInitialization();
    return this.instance.post<T>(endpoint, data);
  }

  public async put<T>(
    endpoint: string,
    data: Partial<T>
  ): Promise<AxiosResponse<T>> {
    this.checkInitialization();
    return this.instance.put<T>(endpoint, data);
  }

  public async patch<T>(
    endpoint: string,
    data: Partial<T>
  ): Promise<AxiosResponse<T>> {
    this.checkInitialization();
    return this.instance.patch<T>(endpoint, data);
  }

  public async delete<T>(endpoint: string): Promise<AxiosResponse<T>> {
    this.checkInitialization();
    return this.instance.delete<T>(endpoint);
  }
}

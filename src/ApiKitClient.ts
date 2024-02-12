import axios, { AxiosInstance, AxiosResponse } from 'axios';

type UnauthorizationCallback = () => void;

export class ApiKitClient {
  private static instance: AxiosInstance;
  private static unauthorizationCallback?: UnauthorizationCallback;

  public static initialize(baseURL: string, authToken: string, unauthorizationCallback?: UnauthorizationCallback): void {
    if (!this.instance) {
      this.instance = axios.create({
        baseURL,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      this.unauthorizationCallback = unauthorizationCallback;

      this.instance.interceptors.response.use(response => response, error => {
        if (error.response?.status === 401 && this.unauthorizationCallback) {
          this.unauthorizationCallback();
        }
        return Promise.reject(error);
      });
    }
  }

  public static async get<T>(endpoint: string, params?: URLSearchParams): Promise<AxiosResponse<T[]>> {
    return this.instance.get<T[]>(endpoint, { params });
  }
    
  public static async getOne<T>(endpoint: string, params?: URLSearchParams): Promise<AxiosResponse<T>> {
    return this.instance.get<T>(endpoint, { params });
  }

  public static async post<T>(endpoint: string, data: T): Promise<AxiosResponse<T>> {
    return this.instance.post<T>(endpoint, data);
  }

  public static async put<T>(endpoint: string, data: T): Promise<AxiosResponse<T>> {
    return this.instance.put<T>(endpoint, data);
  }

  public static async patch<T>(endpoint: string, data: T): Promise<AxiosResponse<T>> {
    return this.instance.patch<T>(endpoint, data);
  }

  public static async delete<T>(endpoint: string): Promise<AxiosResponse<T>> {
    return this.instance.delete<T>(endpoint);
  }
}

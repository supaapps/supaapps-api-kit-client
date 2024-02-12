export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  PATCH = "PATCH",
}
  
export interface ApiResponse<T> {
  status: number;
  data?: T;
  errors?: string[];
}


export interface UnauthorizedResponse {
  status: 401;
  error: string;
}

export type ApiClientResponse<T> = ApiResponse<T> | UnauthorizedResponse;
  
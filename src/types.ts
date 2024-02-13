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
  
export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface PaginatedResponse<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: PaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}
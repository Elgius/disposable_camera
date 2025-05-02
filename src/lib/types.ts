export interface ImageData {
  id: string;
  url: string;
  filename: string;
  createdAt?: string;
  userId?: string;
}

export interface User {
  id: string;
  name: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface ImageData {
  id: string;
  name: string;
  url: string;
  albumCode?: string;
  createdAt: string;
  updatedAt: string;
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

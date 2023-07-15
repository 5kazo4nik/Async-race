import { ApiMethods } from './apiMethods';

export class ApiQuery {
  public static getAll<T>(endpoint: string): Promise<T[]> {
    return ApiMethods.get(`${endpoint}`);
  }

  public static get<T>(endpoint: string, id: number): Promise<T> {
    return ApiMethods.get(`${endpoint}/${id}`);
  }

  public static create<T>(endpoint: string, data: T): Promise<T> {
    return ApiMethods.post(`${endpoint}`, data);
  }

  public static delete(endpoint: string, id: number): Promise<void> {
    return ApiMethods.delete(`${endpoint}/${id}`);
  }

  public static update<T>(endpoint: string, id: number, data: T): Promise<T> {
    return ApiMethods.put(`${endpoint}/${id}`, data);
  }
}

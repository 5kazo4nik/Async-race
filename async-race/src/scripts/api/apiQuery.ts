import { CarData } from '../types/dataTypes';
import { ApiMethods } from './apiMethods';

type EngineStatus = 'started' | 'stopped' | 'drive';

export class ApiQuery {
  public static getAll<T>(endpoint: string): Promise<T[]> {
    return ApiMethods.get(`${endpoint}`);
  }

  public static get<T>(endpoint: string, id: number): Promise<T> {
    return ApiMethods.get(`${endpoint}/${id}`);
  }

  public static create<T>(endpoint: string, data: T): Promise<CarData> {
    return ApiMethods.post(`${endpoint}`, data);
  }

  public static delete(endpoint: string, id: number): Promise<void> {
    return ApiMethods.delete(`${endpoint}/${id}`);
  }

  public static update<T>(endpoint: string, id: number, data: T): Promise<T> {
    return ApiMethods.put(`${endpoint}/${id}`, data);
  }

  public static engine<T>(id: number, status: EngineStatus): Promise<T> {
    return ApiMethods.patch(`engine?id=${id}&status=${status}`);
  }
}

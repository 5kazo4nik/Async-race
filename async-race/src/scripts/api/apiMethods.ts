import { HttpMethod } from '../types/methodType';

export class ApiMethods {
  private static url = ' http://localhost:3000';

  private static async fetch<T>(method: HttpMethod, endpoint: string, body?: unknown): Promise<T> {
    const url = `${ApiMethods.url}/${endpoint}`;
    const res = await fetch(url, {
      method,
      body: body ? JSON.stringify(body) : null,
    });

    const data = await res.json();
    return data;
  }

  public static get<T>(endpoint: string): Promise<T> {
    return this.fetch('GET', endpoint);
  }

  public static post<T>(endpoint: string, body: unknown): Promise<T> {
    return this.fetch('POST', endpoint, body);
  }

  public static patch<T>(endpoint: string, body: unknown): Promise<T> {
    return this.fetch('PATCH', endpoint, body);
  }

  public static delete<T>(endpoint: string): Promise<T> {
    return this.fetch('DELETE', endpoint);
  }
}

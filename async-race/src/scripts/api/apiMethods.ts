import { HttpMethod } from '../types/methodType';

export class ApiMethods {
  private static url = ' http://localhost:3000';

  // eslint-disable-next-line max-len
  private static async fetch<T>(method: HttpMethod, endpoint: string, body?: unknown, headers?: HeadersInit): Promise<T> {
    const url = `${ApiMethods.url}/${endpoint}`;
    const res = await fetch(url, {
      method,
      body: body ? JSON.stringify(body) : null,
      headers,
    });

    const data = await res.json();
    return data;
  }

  public static get<T>(endpoint: string): Promise<T> {
    return this.fetch('GET', endpoint);
  }

  public static post<T>(endpoint: string, body: unknown): Promise<T> {
    return this.fetch('POST', endpoint, body, { 'Content-Type': 'application/json' });
  }

  public static patch<T>(endpoint: string): Promise<T> {
    return this.fetch('PATCH', endpoint);
  }

  public static put<T>(endpoint: string, body: unknown): Promise<T> {
    return this.fetch('PUT', endpoint, body, { 'Content-Type': 'application/json' });
  }

  public static delete<T>(endpoint: string): Promise<T> {
    return this.fetch('DELETE', endpoint);
  }
}

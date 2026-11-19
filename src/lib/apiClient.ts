import { ApiResponse } from "@/server/apiHandler";

export class ApiClientError extends Error {
  public readonly code: string;
  public readonly status: number;
  public readonly details?: any;

  constructor(message: string, code = "CLIENT_ERROR", status = 400, details?: any) {
    super(message);
    this.name = "ApiClientError";
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl = "") {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const json: ApiResponse<T> = await response.json();

      if (!response.ok || !json.success) {
        const errorInfo = json.error || {
          code: `HTTP_${response.status}`,
          message: response.statusText || "Request failed",
        };
        throw new ApiClientError(errorInfo.message, errorInfo.code, response.status, errorInfo.details);
      }

      return json.data as T;
    } catch (err: any) {
      if (err instanceof ApiClientError) {
        throw err;
      }
      throw new ApiClientError(err.message || "Network Error", "NETWORK_ERROR", 500);
    }
  }

  public async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    let query = "";
    if (params) {
      const filtered = Object.entries(params)
        .filter(([_, v]) => v !== undefined && v !== null && v !== "")
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`);
      if (filtered.length > 0) {
        query = `?${filtered.join("&")}`;
      }
    }
    return this.request<T>(`${endpoint}${query}`, { method: "GET" });
  }

  public async post<T>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public async patch<T>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

export const api = new ApiClient();
export default api;

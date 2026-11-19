/**
 * Admin API Client Helper
 * Provides authenticated communication with the backend administration endpoints.
 */

export const ADMIN_MASTER_KEY = "FGCollectiveMasterKey#2026";

export async function adminFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; error?: string }> {
  try {
    const headers = new Headers(options.headers || {});
    if (!headers.has("Content-Type") && options.body && typeof options.body === "string") {
      headers.set("Content-Type", "application/json");
    }
    // Always include admin key header for administrative operations
    headers.set("x-admin-master-key", ADMIN_MASTER_KEY);

    const res = await fetch(endpoint, {
      ...options,
      headers,
      credentials: "include",
    });

    const json = await res.json().catch(() => null);

    if (!res.ok) {
      const errMsg = json?.error?.message || json?.message || `Request failed with status ${res.status}`;
      return { success: false, error: errMsg };
    }

    return { success: true, data: json?.data !== undefined ? json.data : json };
  } catch (err: any) {
    return { success: false, error: err.message || "Network error" };
  }
}

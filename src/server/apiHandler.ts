import { NextRequest, NextResponse } from "next/server";
import { AppError } from "./errors/AppError";
import { logger } from "./logger";

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta: {
    timestamp: string;
    requestId: string;
    durationMs?: number;
  };
}

export type RouteHandler<T = any> = (
  req: NextRequest,
  context: { params?: Promise<any> }
) => Promise<T>;

export function apiHandler<T>(
  handler: RouteHandler<T>,
  options?: { contextName?: string }
) {
  const contextName = options?.contextName || "API";

  return async (req: NextRequest, routeContext: { params?: Promise<any> }) => {
    const startTime = Date.now();
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const url = req.nextUrl.pathname;
    const method = req.method;

    logger.info(`--> ${method} ${url}`, { query: Object.fromEntries(req.nextUrl.searchParams) }, contextName, requestId);

    try {
      const data = await handler(req, routeContext);
      const durationMs = Date.now() - startTime;

      logger.info(`<-- ${method} ${url} 200 (${durationMs}ms)`, {}, contextName, requestId);

      const responsePayload: ApiResponse<T> = {
        success: true,
        data,
        meta: {
          timestamp: new Date().toISOString(),
          requestId,
          durationMs,
        },
      };

      return NextResponse.json(responsePayload, { status: 200 });
    } catch (err: any) {
      const durationMs = Date.now() - startTime;
      const statusCode = err instanceof AppError ? err.statusCode : 500;
      const errorCode = err instanceof AppError ? err.errorCode : "INTERNAL_SERVER_ERROR";
      const errorMessage = err instanceof Error ? err.message : "Internal Server Error";
      const details = err instanceof AppError ? err.details : undefined;

      logger.error(`<-- ${method} ${url} ${statusCode} (${durationMs}ms) - ${errorMessage}`, err, contextName, requestId);

      const responsePayload: ApiResponse = {
        success: false,
        error: {
          code: errorCode,
          message: errorMessage,
          details,
        },
        meta: {
          timestamp: new Date().toISOString(),
          requestId,
          durationMs,
        },
      };

      return NextResponse.json(responsePayload, { status: statusCode });
    }
  };
}

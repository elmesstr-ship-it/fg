type LogLevel = "INFO" | "WARN" | "ERROR" | "DEBUG";

interface LogPayload {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: string;
  requestId?: string;
  meta?: Record<string, any>;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

class ServerLogger {
  private formatLog(payload: LogPayload): string {
    return JSON.stringify(payload);
  }

  public info(message: string, meta?: Record<string, any>, context = "App", requestId?: string) {
    const payload: LogPayload = {
      level: "INFO",
      message,
      timestamp: new Date().toISOString(),
      context,
      requestId,
      meta,
    };
    console.log(`[${payload.timestamp}] [INFO] [${context}] ${message}`, meta ? JSON.stringify(meta) : "");
  }

  public warn(message: string, meta?: Record<string, any>, context = "App", requestId?: string) {
    const payload: LogPayload = {
      level: "WARN",
      message,
      timestamp: new Date().toISOString(),
      context,
      requestId,
      meta,
    };
    console.warn(`[${payload.timestamp}] [WARN] [${context}] ${message}`, meta ? JSON.stringify(meta) : "");
  }

  public error(message: string, error?: any, context = "App", requestId?: string) {
    const errorDetails = error instanceof Error ? {
      name: error.name,
      message: error.message,
      stack: error.stack,
    } : { name: "UnknownError", message: String(error) };

    const payload: LogPayload = {
      level: "ERROR",
      message,
      timestamp: new Date().toISOString(),
      context,
      requestId,
      error: errorDetails,
    };
    console.error(`[${payload.timestamp}] [ERROR] [${context}] ${message}`, errorDetails);
  }
}

export const logger = new ServerLogger();

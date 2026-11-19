import { ValidationError } from "../errors/AppError";

export interface ValidationRule {
  field: string;
  required?: boolean;
  type?: "string" | "number" | "boolean" | "object" | "array";
  min?: number;
  max?: number;
  email?: boolean;
  custom?: (val: any) => boolean | string;
}

export function validateRequest<T extends Record<string, any>>(data: any, rules: ValidationRule[]): T {
  if (!data || typeof data !== "object") {
    throw new ValidationError("Invalid request body. Expected JSON object.");
  }

  const errors: Record<string, string> = {};

  for (const rule of rules) {
    const val = data[rule.field];

    // Check required
    if (rule.required && (val === undefined || val === null || val === "")) {
      errors[rule.field] = `Field '${rule.field}' is required.`;
      continue;
    }

    if (val === undefined || val === null) {
      continue;
    }

    // Check type
    if (rule.type) {
      if (rule.type === "array") {
        if (!Array.isArray(val)) {
          errors[rule.field] = `Field '${rule.field}' must be an array.`;
          continue;
        }
      } else if (typeof val !== rule.type) {
        errors[rule.field] = `Field '${rule.field}' must be of type ${rule.type}.`;
        continue;
      }
    }

    // Check min / max for numbers and strings
    if (typeof val === "number") {
      if (rule.min !== undefined && val < rule.min) {
        errors[rule.field] = `Field '${rule.field}' must be at least ${rule.min}.`;
      }
      if (rule.max !== undefined && val > rule.max) {
        errors[rule.field] = `Field '${rule.field}' must be at most ${rule.max}.`;
      }
    }

    if (typeof val === "string") {
      if (rule.min !== undefined && val.trim().length < rule.min) {
        errors[rule.field] = `Field '${rule.field}' must have at least ${rule.min} characters.`;
      }
      if (rule.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(val)) {
          errors[rule.field] = `Field '${rule.field}' must be a valid email address.`;
        }
      }
    }

    // Custom check
    if (rule.custom) {
      const customRes = rule.custom(val);
      if (customRes !== true) {
        errors[rule.field] = typeof customRes === "string" ? customRes : `Field '${rule.field}' failed validation.`;
      }
    }
  }

  if (Object.keys(errors).length > 0) {
    throw new ValidationError("Validation failed", errors);
  }

  return data as T;
}

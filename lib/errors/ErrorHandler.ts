/**
 * Comprehensive Error Handler
 * Phase 1: Advanced Error Management & User Feedback
 * 
 * Provides centralized error handling with user-friendly messages
 * and detailed logging for debugging
 */

export type ErrorSeverity = 'info' | 'warning' | 'error' | 'critical';

export interface AppError {
  code: string;
  message: string;
  userMessage: string;
  severity: ErrorSeverity;
  timestamp: Date;
  context?: Record<string, any>;
  stack?: string;
}

export class ErrorLogger {
  private static errors: AppError[] = [];
  private static maxErrors = 1000;

  /**
   * Log an error with context
   */
  static logError(
    code: string,
    message: string,
    userMessage: string,
    severity: ErrorSeverity = 'error',
    context?: Record<string, any>,
    stack?: string
  ): AppError {
    const error: AppError = {
      code,
      message,
      userMessage,
      severity,
      timestamp: new Date(),
      context,
      stack,
    };

    // Store in memory
    this.errors.push(error);

    // Keep only last N errors
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(-this.maxErrors);
    }

    // Log to console in development
    if (__DEV__) {
      console.error(`[${severity.toUpperCase()}] ${code}`, {
        message,
        userMessage,
        context,
        stack,
      });
    }

    return error;
  }

  /**
   * Get all logged errors
   */
  static getErrors(
    severity?: ErrorSeverity,
    limit?: number
  ): AppError[] {
    let filtered = this.errors;

    if (severity) {
      filtered = filtered.filter(e => e.severity === severity);
    }

    if (limit) {
      filtered = filtered.slice(-limit);
    }

    return filtered;
  }

  /**
   * Clear error log
   */
  static clearErrors(): void {
    this.errors = [];
  }

  /**
   * Export errors as JSON
   */
  static exportAsJSON(): string {
    return JSON.stringify(this.errors, null, 2);
  }
}

/**
 * Custom Error Class
 */
export class CalculationError extends Error {
  constructor(
    public code: string,
    public userMessage: string,
    message: string,
    severity: ErrorSeverity = 'error'
  ) {
    super(message);
    this.name = 'CalculationError';

    ErrorLogger.logError(code, message, userMessage, severity, {}, new Error().stack);
  }
}

export class ValidationError extends Error {
  constructor(
    public field: string,
    public userMessage: string,
    message: string
  ) {
    super(message);
    this.name = 'ValidationError';

    ErrorLogger.logError(
      `VALIDATION_ERROR:${field}`,
      message,
      userMessage,
      'warning',
      { field },
      new Error().stack
    );
  }
}

export class EstateCalculationError extends CalculationError {
  constructor(message: string, userMessage: string) {
    super('ESTATE_CALC_ERROR', userMessage, message, 'error');
  }
}

export class HeirValidationError extends ValidationError {
  constructor(field: string, userMessage: string, message: string) {
    super(field, userMessage, message);
  }
}

/**
 * Error Recovery Strategies
 */
export class ErrorRecovery {
  static async handleEstateError(error: Error): Promise<void> {
    if (error instanceof EstateCalculationError) {
      console.warn(`Estate Calculation Issue: ${error.userMessage}`);
      // Notify user
      return;
    }

    // Generic estate error
    ErrorLogger.logError(
      'ESTATE_ERROR',
      error.message,
      'Unable to process estate data. Please check your inputs.',
      'error'
    );
  }

  static async handleHeirError(error: Error): Promise<void> {
    if (error instanceof HeirValidationError) {
      console.warn(`Heir Validation Issue: ${error.userMessage}`);
      return;
    }

    ErrorLogger.logError(
      'HEIR_ERROR',
      error.message,
      'Unable to process heir data. Please verify the information.',
      'error'
    );
  }

  static async handleCalculationError(error: Error): Promise<void> {
    if (error instanceof CalculationError) {
      console.error(`Calculation Error: ${error.userMessage}`);
      return;
    }

    ErrorLogger.logError(
      'CALCULATION_ERROR',
      error.message,
      'An error occurred during calculation. Please try again.',
      'critical'
    );
  }
}

/**
 * Error Context Manager
 */
export class ErrorContext {
  private context: Record<string, any> = {};

  setContext(key: string, value: any): void {
    this.context[key] = value;
  }

  getContext(): Record<string, any> {
    return { ...this.context };
  }

  clear(): void {
    this.context = {};
  }
}

// Declare __DEV__ for development mode detection
declare const __DEV__: boolean;

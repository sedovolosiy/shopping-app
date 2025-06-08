// Error handling utilities for the Shopping Optimizer app
// Provides consistent error handling patterns across components

export interface ErrorInfo {
  message: string;
  code?: string;
  type: 'user' | 'system' | 'network' | 'validation';
  retryable?: boolean;
}

export class AppError extends Error {
  public readonly code?: string;
  public readonly type: ErrorInfo['type'];
  public readonly retryable: boolean;

  constructor(message: string, options: Partial<ErrorInfo> = {}) {
    super(message);
    this.name = 'AppError';
    this.code = options.code;
    this.type = options.type || 'system';
    this.retryable = options.retryable || false;
  }
}

// Pre-defined error categories
export const ErrorCodes = {
  // Network errors
  NETWORK_ERROR: 'NETWORK_ERROR',
  API_TIMEOUT: 'API_TIMEOUT',
  API_UNAVAILABLE: 'API_UNAVAILABLE',
  
  // Authentication errors
  AUTH_REQUIRED: 'AUTH_REQUIRED',
  AUTH_FAILED: 'AUTH_FAILED',
  SESSION_EXPIRED: 'SESSION_EXPIRED',
  
  // Validation errors
  INVALID_INPUT: 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',
  INVALID_STORE: 'INVALID_STORE',
  
  // Business logic errors
  LIST_NOT_FOUND: 'LIST_NOT_FOUND',
  PROCESSING_FAILED: 'PROCESSING_FAILED',
  AI_UNAVAILABLE: 'AI_UNAVAILABLE',
  
  // System errors
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  STORAGE_ERROR: 'STORAGE_ERROR',
} as const;

// Error message mappings for user-friendly display
export const ErrorMessages: Record<string, string> = {
  [ErrorCodes.NETWORK_ERROR]: 'Проблема с сетевым соединением. Проверьте подключение к интернету.',
  [ErrorCodes.API_TIMEOUT]: 'Запрос выполняется слишком долго. Попробуйте еще раз.',
  [ErrorCodes.API_UNAVAILABLE]: 'Сервис временно недоступен. Попробуйте позже.',
  
  [ErrorCodes.AUTH_REQUIRED]: 'Для выполнения этого действия необходимо войти в аккаунт.',
  [ErrorCodes.AUTH_FAILED]: 'Ошибка входа в аккаунт. Проверьте данные и попробуйте снова.',
  [ErrorCodes.SESSION_EXPIRED]: 'Ваша сессия истекла. Войдите в аккаунт заново.',
  
  [ErrorCodes.INVALID_INPUT]: 'Некорректные данные. Проверьте правильность ввода.',
  [ErrorCodes.MISSING_REQUIRED_FIELD]: 'Заполните все обязательные поля.',
  [ErrorCodes.INVALID_STORE]: 'Выбранный магазин недоступен.',
  
  [ErrorCodes.LIST_NOT_FOUND]: 'Список покупок не найден.',
  [ErrorCodes.PROCESSING_FAILED]: 'Не удалось обработать список. Попробуйте еще раз.',
  [ErrorCodes.AI_UNAVAILABLE]: 'ИИ-обработка недоступна. Используется базовая категоризация.',
  
  [ErrorCodes.UNKNOWN_ERROR]: 'Произошла неизвестная ошибка. Попробуйте еще раз.',
  [ErrorCodes.STORAGE_ERROR]: 'Ошибка сохранения данных.',
};

// Error handler functions
export const handleError = (error: unknown): ErrorInfo => {
  if (error instanceof AppError) {
    return {
      message: ErrorMessages[error.code || ''] || error.message,
      code: error.code,
      type: error.type,
      retryable: error.retryable,
    };
  }

  if (error instanceof Error) {
    // Handle specific error types
    if (error.name === 'NetworkError' || error.message.includes('fetch')) {
      return {
        message: ErrorMessages[ErrorCodes.NETWORK_ERROR],
        code: ErrorCodes.NETWORK_ERROR,
        type: 'network',
        retryable: true,
      };
    }

    if (error.message.includes('timeout')) {
      return {
        message: ErrorMessages[ErrorCodes.API_TIMEOUT],
        code: ErrorCodes.API_TIMEOUT,
        type: 'network',
        retryable: true,
      };
    }

    if (error.message.includes('401') || error.message.includes('unauthorized')) {
      return {
        message: ErrorMessages[ErrorCodes.AUTH_FAILED],
        code: ErrorCodes.AUTH_FAILED,
        type: 'user',
        retryable: false,
      };
    }

    // Generic error handling
    return {
      message: error.message || ErrorMessages[ErrorCodes.UNKNOWN_ERROR],
      code: ErrorCodes.UNKNOWN_ERROR,
      type: 'system',
      retryable: false,
    };
  }

  // Handle non-Error objects
  return {
    message: ErrorMessages[ErrorCodes.UNKNOWN_ERROR],
    code: ErrorCodes.UNKNOWN_ERROR,
    type: 'system',
    retryable: false,
  };
};

// API error handler for fetch responses
export const handleApiError = async (response: Response): Promise<ErrorInfo> => {
  try {
    const data = await response.json();
    const message = data.error || data.message || 'API request failed';
    
    switch (response.status) {
      case 400:
        return {
          message: data.error || ErrorMessages[ErrorCodes.INVALID_INPUT],
          code: ErrorCodes.INVALID_INPUT,
          type: 'validation',
          retryable: false,
        };
      case 401:
        return {
          message: ErrorMessages[ErrorCodes.AUTH_FAILED],
          code: ErrorCodes.AUTH_FAILED,
          type: 'user',
          retryable: false,
        };
      case 404:
        return {
          message: data.error || ErrorMessages[ErrorCodes.LIST_NOT_FOUND],
          code: ErrorCodes.LIST_NOT_FOUND,
          type: 'user',
          retryable: false,
        };
      case 408:
        return {
          message: ErrorMessages[ErrorCodes.API_TIMEOUT],
          code: ErrorCodes.API_TIMEOUT,
          type: 'network',
          retryable: true,
        };
      case 500:
      case 502:
      case 503:
        return {
          message: ErrorMessages[ErrorCodes.API_UNAVAILABLE],
          code: ErrorCodes.API_UNAVAILABLE,
          type: 'system',
          retryable: true,
        };
      default:
        return {
          message: message,
          code: ErrorCodes.UNKNOWN_ERROR,
          type: 'system',
          retryable: false,
        };
    }
  } catch (parseError) {
    return {
      message: ErrorMessages[ErrorCodes.API_UNAVAILABLE],
      code: ErrorCodes.API_UNAVAILABLE,
      type: 'system',
      retryable: true,
    };
  }
};

// Validation helpers
export const validateRequiredFields = (fields: Record<string, any>): ErrorInfo | null => {
  for (const [fieldName, value] of Object.entries(fields)) {
    if (value === null || value === undefined || value === '') {
      return {
        message: `${fieldName} ${ErrorMessages[ErrorCodes.MISSING_REQUIRED_FIELD]}`,
        code: ErrorCodes.MISSING_REQUIRED_FIELD,
        type: 'validation',
        retryable: false,
      };
    }
  }
  return null;
};

// Retry mechanism helper
export const withRetry = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: unknown;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      const errorInfo = handleError(error);
      
      // Don't retry if error is not retryable or it's the last attempt
      if (!errorInfo.retryable || attempt === maxRetries) {
        throw error;
      }
      
      // Wait before retrying with exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }
  
  throw lastError;
};

// React hook for error handling
export const useErrorHandler = () => {
  const handleErrorWithFeedback = (error: unknown): ErrorInfo => {
    const errorInfo = handleError(error);
    
    // Log errors in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Application Error:', {
        originalError: error,
        errorInfo,
        timestamp: new Date().toISOString(),
      });
    }
    
    return errorInfo;
  };

  return { handleErrorWithFeedback };
};

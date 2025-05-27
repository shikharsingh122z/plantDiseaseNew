import { API_URL } from './config';

interface LogData {
  level: 'info' | 'warn' | 'error';
  message: string;
  userId?: string;
  context?: Record<string, any>;
}

/**
 * Send log data to the backend API
 */
const sendLog = async (data: LogData): Promise<void> => {
  try {
    // Check if we're in development mode
    const isDev = import.meta.env.DEV;
    
    // Always log to console in development
    if (isDev) {
      const logMethod = data.level === 'error' 
        ? console.error 
        : data.level === 'warn' 
          ? console.warn 
          : console.log;
      
      logMethod(`[${data.level.toUpperCase()}] ${data.message}`, data.context || '');
    }
    
    // Send to backend (even in development)
    await fetch(`${API_URL}/logs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        timestamp: new Date().toISOString(),
        source: 'frontend',
        userAgent: navigator.userAgent,
      }),
    });
  } catch (error) {
    // If logging fails, at least log to console
    console.error('Failed to send log to server:', error);
  }
};

/**
 * Log information
 */
export const logInfo = (message: string, userId?: string, context?: Record<string, any>): void => {
  sendLog({
    level: 'info',
    message,
    userId,
    context,
  });
};

/**
 * Log warning
 */
export const logWarning = (message: string, userId?: string, context?: Record<string, any>): void => {
  sendLog({
    level: 'warn',
    message,
    userId,
    context,
  });
};

/**
 * Log error
 */
export const logError = (message: string, userId?: string, context?: Record<string, any>): void => {
  sendLog({
    level: 'error',
    message,
    userId,
    context,
  });
};

/**
 * Log API request
 */
export const logApiRequest = (
  endpoint: string, 
  method: string, 
  status: number, 
  userId?: string,
  requestData?: Record<string, any>,
  responseData?: Record<string, any>
): void => {
  sendLog({
    level: 'info',
    message: `API Request: ${method} ${endpoint} (${status})`,
    userId,
    context: {
      endpoint,
      method,
      status,
      requestData,
      responseData: responseData ? { 
        // Only include non-sensitive fields in logs
        success: responseData.success,
        error: responseData.error,
        count: responseData.count,
      } : undefined,
    },
  });
};

/**
 * Log disease prediction
 */
export const logDiseasePrediction = (
  disease: string,
  userId?: string,
  context?: Record<string, any>
): void => {
  sendLog({
    level: 'info',
    message: `Disease Prediction: ${disease}`,
    userId,
    context,
  });
}; 
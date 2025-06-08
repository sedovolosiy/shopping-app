import React from 'react';
import { AlertCircle, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { ErrorInfo } from '@/lib/error-handling';

interface ErrorDisplayProps {
  error: ErrorInfo | null;
  onRetry?: () => void;
  onDismiss?: () => void;
  className?: string;
  compact?: boolean;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  onRetry,
  onDismiss,
  className = '',
  compact = false
}) => {
  if (!error) return null;

  const getErrorIcon = () => {
    switch (error.type) {
      case 'network':
        return <WifiOff className="h-5 w-5" />;
      case 'validation':
        return <AlertCircle className="h-5 w-5" />;
      default:
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  const getErrorColor = () => {
    switch (error.type) {
      case 'validation':
        return 'border-orange-200 bg-orange-50 text-orange-800 dark:border-orange-800 dark:bg-orange-900/20 dark:text-orange-200';
      case 'network':
        return 'border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-200';
      case 'user':
        return 'border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200';
      default:
        return 'border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-200';
    }
  };

  if (compact) {
    return (
      <div className={`flex items-center gap-2 p-2 rounded-md border ${getErrorColor()} ${className}`}>
        {getErrorIcon()}
        <span className="text-sm font-medium">{error.message}</span>
        {error.retryable && onRetry && (
          <button
            onClick={onRetry}
            className="ml-auto p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded transition-colors"
            title="Повторить"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        )}
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded transition-colors"
            title="Закрыть"
          >
            ×
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`rounded-lg border p-4 ${getErrorColor()} ${className}`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          {getErrorIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold mb-1">
            {error.type === 'network' && 'Проблема с соединением'}
            {error.type === 'validation' && 'Ошибка ввода'}
            {error.type === 'user' && 'Действие недоступно'}
            {error.type === 'system' && 'Системная ошибка'}
          </h3>
          <p className="text-sm">{error.message}</p>
          {error.code && (
            <p className="text-xs mt-1 opacity-75">Код ошибки: {error.code}</p>
          )}
        </div>
        <div className="flex-shrink-0 flex gap-2">
          {error.retryable && onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium border border-current rounded-md hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            >
              <RefreshCw className="h-3 w-3" />
              Повторить
            </button>
          )}
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="inline-flex items-center px-2 py-1.5 text-xs font-medium hover:bg-black/10 dark:hover:bg-white/10 rounded-md transition-colors"
            >
              ×
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorDisplay;

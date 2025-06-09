'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, ArrowRight } from 'lucide-react';
import ErrorDisplay from '@/components/error-display';
import { ErrorInfo, handleError, useErrorHandler, withRetry } from '@/lib/error-handling';

interface UserLoginProps {
  onUserSelect: (userId: string) => void;
  isLoading?: boolean;
}

export default function UserLogin({ onUserSelect, isLoading = false }: UserLoginProps) {
  const [userId, setUserId] = useState<string>('');
  const [error, setError] = useState<ErrorInfo | null>(null);
  const { handleErrorWithFeedback } = useErrorHandler();

  // Вычисляем, активна ли кнопка
  const isButtonDisabled = useMemo(() => {
    return isLoading || !userId.trim();
  }, [isLoading, userId]);

  // Простая валидация email
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedUserId = userId.trim();
    
    if (!trimmedUserId) {
      setError({
        message: 'Пожалуйста, введите ваш ID пользователя',
        code: 'MISSING_REQUIRED_FIELD',
        type: 'validation',
        retryable: false,
      });
      return;
    }
    
    if (trimmedUserId.includes('@') && !isValidEmail(trimmedUserId)) {
      setError({
        message: 'Пожалуйста, введите действительный email адрес',
        code: 'INVALID_INPUT',
        type: 'validation',
        retryable: false,
      });
      return;
    }
    
    setError(null);
    
    try {
      await withRetry(async () => {
        // Проверяем или создаём пользователя
        const res = await fetch('/api/user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: trimmedUserId })
        });
        
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        
        const data = await res.json();
        if (!data || !data.userId) {
          throw new Error('Invalid response from server');
        }
        
        onUserSelect(data.userId);
      }, 3, 1000);
    } catch (err) {
      const errorInfo = handleErrorWithFeedback(err);
      setError(errorInfo);
    }
  };

  const handleQuickSelect = (quickUserId: string) => {
    setUserId(quickUserId);
    setError(null); // Очищаем ошибки при быстром выборе
    onUserSelect(quickUserId);
  };

  const handleRetry = () => {
    setError(null);
    handleSubmit(new Event('submit') as any);
  };

  return (
    <div className="login-screen">
      <Card className="screen-card w-full max-w-md mx-4 shadow-lg dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="text-center py-6 px-5">
          <div className="w-20 h-20 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center mx-auto mb-5">
            <User className="h-9 w-9 text-primary" />
          </div>
          <CardTitle className="text-2xl mb-2 dark:text-white">Добро пожаловать!</CardTitle>
          <CardDescription className="text-base text-gray-600 dark:text-gray-300">
            Введите ваш ID для доступа к спискам покупок
          </CardDescription>
        </CardHeader>
        
        <CardContent className="px-5 pb-6 space-y-6">
          {/* Error Display */}
          <ErrorDisplay 
            error={error} 
            onRetry={error?.retryable ? handleRetry : undefined}
            onDismiss={() => setError(null)}
            compact
          />
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="form-input-group">
              <Label htmlFor="userId" className="form-label">ID пользователя</Label>
              <Input
                id="userId"
                type="text"
                placeholder="например: ivan@example.com"
                value={userId}
                onChange={(e) => {
                  setUserId(e.target.value);
                  setError(null);
                }}
                disabled={isLoading}
                className={`form-input ${error?.type === 'validation' ? 'border-red-500 focus:border-red-500' : ''} dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400`}
              />
              {userId.trim().length > 0 && (
                <p className="text-xs text-muted-foreground">
                  Символов введено: {userId.trim().length}
                </p>
              )}
            </div>
            
            <Button 
              type="submit" 
              className="form-submit mt-6" 
              disabled={isButtonDisabled}
            >
              {isLoading ? (
                <>
                  <span className="mr-2">Загрузка...</span>
                  <div className="h-5 w-5 rounded-full border-2 border-current border-t-transparent animate-spin"></div>
                </>
              ) : (
                <>
                  Войти
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </form>
          
          <div className="border-t border-gray-200 dark:border-gray-600 mt-6 pt-6">
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-3">Быстрый вход</p>
            <div className="flex justify-center">
              <Button
                variant="outline"
                className="mobile-button mobile-button-outline h-12 w-40 text-base font-semibold shadow-sm border-gray-300 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-200 dark:hover:text-white dark:hover:bg-gray-700 transition-colors duration-150"
                onClick={() => handleQuickSelect('guest-user')}
                disabled={isLoading}
              >
                Гость
              </Button>
            </div>
          </div>
          
        </CardContent>
      </Card>
    </div>
  );
}

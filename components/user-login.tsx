'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, ArrowRight } from 'lucide-react';

interface UserLoginProps {
  onUserSelect: (userId: string) => void;
  isLoading?: boolean;
}

export default function UserLogin({ onUserSelect, isLoading = false }: UserLoginProps) {
  const [userId, setUserId] = useState<string>('');
  const [error, setError] = useState<string>('');

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
      setError('Пожалуйста, введите ваш ID пользователя');
      return;
    }
    if (trimmedUserId.includes('@') && !isValidEmail(trimmedUserId)) {
      setError('Пожалуйста, введите действительный email адрес');
      return;
    }
    setError('');
    try {
      // Проверяем или создаём пользователя
      const res = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: trimmedUserId })
      });
      if (!res.ok) {
        throw new Error('Ошибка при обращении к серверу');
      }
      const data = await res.json();
      if (!data || !data.userId) {
        setError('Не удалось получить ID пользователя');
        return;
      }
      onUserSelect(data.userId);
    } catch (err) {
      setError('Ошибка при обращении к серверу');
    }
  };

  const handleQuickSelect = (quickUserId: string) => {
    setUserId(quickUserId);
    setError(''); // Очищаем ошибки при быстром выборе
    onUserSelect(quickUserId);
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
            <User className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Добро пожаловать!</CardTitle>
          <CardDescription>
            Введите ваш ID пользователя для доступа к спискам покупок
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userId">ID пользователя</Label>
              <Input
                id="userId"
                type="text"
                placeholder="например: ivan@example.com или ivan123"
                value={userId}
                onChange={(e) => {
                  setUserId(e.target.value);
                  setError('');
                }}
                disabled={isLoading}
                className={error ? 'border-red-500' : ''}
              />
              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}
              {userId.trim().length > 0 && (
                <p className="text-xs text-muted-foreground">
                  Символов введено: {userId.trim().length}
                </p>
              )}
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isButtonDisabled}
            >
              {isLoading ? (
                'Загрузка...'
              ) : (
                <>
                  Войти
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                или быстрый выбор
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              onClick={() => handleQuickSelect('guest-user')}
              disabled={isLoading}
              className="text-sm"
            >
              Гость
            </Button>
            <Button
              variant="outline"
              onClick={() => handleQuickSelect('demo-user')}
              disabled={isLoading}
              className="text-sm"
            >
              Демо
            </Button>
          </div>
          
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Ваши списки покупок будут сохранены под этим ID
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

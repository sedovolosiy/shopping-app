// app/api/status/route.ts
import { NextResponse } from 'next/server';
import { validateEnv, env } from '@/lib/env-config';

/**
 * API endpoint для проверки состояния системы
 * Возвращает статус API и конфигурацию (без секретов)
 */
export async function GET() {
  const envValid = validateEnv();
  
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    config: {
      usingAI: env.NEXT_PUBLIC_USING_AI,
      aiConfigured: Boolean(env.GOOGLE_GEMINI_API_KEY),
      dbConfigured: Boolean(env.DATABASE_URL),
      environment: process.env.NODE_ENV,
      apiVersion: '1.0',
    },
    features: {
      aiProcessing: env.NEXT_PUBLIC_USING_AI && Boolean(env.GOOGLE_GEMINI_API_KEY),
      shoppingListManagement: true,
      storeManagement: true,
      userPreferences: true,
    },
    validationResult: envValid ? 'valid' : 'invalid'
  }, { status: 200 });
}

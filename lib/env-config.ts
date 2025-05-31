/**
 * Environment variable configuration file for Next.js
 * This helps validate and type-check environment variables
 */

export const env = {
  // Server-side environment variables
  GOOGLE_GEMINI_API_KEY: process.env.GOOGLE_GEMINI_API_KEY || '',
  DATABASE_URL: process.env.DATABASE_URL || 'file:./prisma/dev.db',

  // Client-side environment variables (must be prefixed with NEXT_PUBLIC_)
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  NEXT_PUBLIC_USING_AI: process.env.NEXT_PUBLIC_USING_AI === 'true',
}

/**
 * Check if required environment variables are set
 */
export function validateEnv() {
  const missingVars: string[] = []

  if (!env.DATABASE_URL) missingVars.push('DATABASE_URL')
  
  // Only add GOOGLE_GEMINI_API_KEY to missing vars if we're using AI
  if (env.NEXT_PUBLIC_USING_AI && !env.GOOGLE_GEMINI_API_KEY) {
    missingVars.push('GOOGLE_GEMINI_API_KEY')
  }

  if (missingVars.length > 0) {
    console.warn(`⚠️ Missing environment variables: ${missingVars.join(', ')}`)
    return false
  }

  return true
}

// Run validation in development
if (process.env.NODE_ENV !== 'production') {
  validateEnv()
}

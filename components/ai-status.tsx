'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

interface AIStatusProps {
  isActive?: boolean;
  aiModel?: string;
}

/**
 * Component to display AI processing status
 */
export default function AIStatus({ isActive = false, aiModel = 'Gemini' }: AIStatusProps) {
  if (!isActive) return null;
  
  return (
    <div className="absolute top-2 right-2 flex items-center gap-1 text-xs bg-indigo-100 text-indigo-700 py-1 px-2 rounded-full">
      <Sparkles size={12} className="animate-pulse" />
      <span>AI Powered</span>
    </div>
  );
}

export function AITag({ isActive = false }: { isActive?: boolean }) {
  if (!isActive) return null;
  
  return (
    <div className="inline-flex items-center gap-1 text-xs font-medium bg-indigo-100 text-indigo-700 py-0.5 px-2 rounded-md">
      <Sparkles size={12} />
      <span>AI</span>
    </div>
  );
}

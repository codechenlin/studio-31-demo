
import React from 'react';
import {LanguageProvider} from '@/context/language-context';
import AuthLayoutClient from './auth-layout-client';

export default function AuthLayout({children}: {children: React.ReactNode}) {
  return (
    <LanguageProvider>
      <AuthLayoutClient>{children}</AuthLayoutClient>
    </LanguageProvider>
  );
}

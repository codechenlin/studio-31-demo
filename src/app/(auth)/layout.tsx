
import React, { Suspense } from "react";
import fs from 'fs/promises';
import path from 'path';
import { LanguageProvider } from "@/context/language-context";
import AuthLayoutClient from './auth-layout-client';

async function readConfig() {
  try {
    const configPath = path.join(process.cwd(), 'src', 'app', 'lib', 'app-config.json');
    const fileContent = await fs.readFile(configPath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("Failed to read app-config.json:", error);
    // Return default values if the file can't be read
    return {
      loginBackgroundImageUrl: 'https://picsum.photos/seed/1/1200/800',
      signupBackgroundImageUrl: 'https://picsum.photos/seed/2/1200/800',
      forgotPasswordBackgroundImageUrl: 'https://picsum.photos/seed/3/1200/800',
    };
  }
}

export default async function AuthLayout({ children, login, signup, forgotPassword }: {
  children: React.ReactNode;
  login: React.ReactNode;
  signup: React.ReactNode;
  forgotPassword: React.ReactNode;
}) {
  const config = await readConfig();

  // We need to clone the elements to pass the props down.
  // This is a common pattern for passing server-side data to client components
  // in specific slots.
  const enhancedLogin = React.cloneElement(login as React.ReactElement, { backgroundImageUrl: config.loginBackgroundImageUrl });
  const enhancedSignup = React.cloneElement(signup as React.ReactElement, { backgroundImageUrl: config.signupBackgroundImageUrl });
  const enhancedForgotPassword = React.cloneElement(forgotPassword as React.ReactElement, { backgroundImageUrl: config.forgotPasswordBackgroundImageUrl });

  return (
    <LanguageProvider>
      <AuthLayoutClient>
        {children}
        {enhancedLogin}
        {enhancedSignup}
        {enhancedForgotPassword}
      </AuthLayoutClient>
    </LanguageProvider>
  );
}


import React from 'react';
import AdminLayoutClient from './layout-client';
import { LogoProvider } from "@/context/logo-context";
import fs from 'fs/promises';
import path from 'path';

interface AppConfig {
  logoLightUrl: string | null;
  logoDarkUrl: string | null;
  [key: string]: string | null;
}

async function getAppConfig() {
  const configPath = path.join(process.cwd(), 'src', 'app', 'lib', 'app-config.json');
  try {
    const fileContent = await fs.readFile(configPath, 'utf-8');
    return JSON.parse(fileContent) as AppConfig;
  } catch (error) {
    console.error("Failed to read app-config.json in admin layout:", error);
    return {
      logoLightUrl: null,
      logoDarkUrl: null,
    };
  }
}

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const config = await getAppConfig();
  
  return (
    <LogoProvider logoLightUrl={config.logoLightUrl} logoDarkUrl={config.logoDarkUrl}>
      <AdminLayoutClient>{children}</AdminLayoutClient>
    </LogoProvider>
  );
}

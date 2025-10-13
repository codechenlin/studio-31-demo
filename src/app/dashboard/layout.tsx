
import React from 'react';
import { LogoProvider } from "@/context/logo-context";
import DashboardLayoutClient from './layout-client';
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
    console.error("Failed to read app-config.json in dashboard layout:", error);
    return {
      logoLightUrl: null,
      logoDarkUrl: null,
    };
  }
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const config = await getAppConfig();

  return (
    <LogoProvider logoLightUrl={config.logoLightUrl} logoDarkUrl={config.logoDarkUrl}>
      <DashboardLayoutClient>{children}</DashboardLayoutClient>
    </LogoProvider>
  );
}

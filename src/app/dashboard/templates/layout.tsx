
"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import DashboardLayout from '@/app/dashboard/layout';

export default function TemplatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // This is a simple router. If the path is the create page, it renders the children directly.
  // Otherwise, it wraps the children with the DashboardLayout.
  // This approach is not ideal for Next.js App Router and can cause issues.
  // A better approach is using Route Groups to define different layouts for different routes.
  if (pathname === '/dashboard/templates/create') {
    return <>{children}</>;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}


"use client";

import React from 'react';
import DashboardLayout from '@/app/dashboard/layout';

// This layout component applies the main DashboardLayout to all its children.
// The template editor, being in a different route group `(editor)`, will not be affected by this layout.
// This is a cleaner approach than conditional rendering based on pathname.
export default function TemplatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}

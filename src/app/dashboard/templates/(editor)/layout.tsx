
"use client"

import React from 'react';
import { usePathname } from 'next/navigation';

export default function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // This layout ensures that the children (the create page) are rendered in a full-screen "canvas" mode
  // without inheriting the main dashboard layout (sidebar, header, etc.).
  // We exclude the preview page from this special layout.
  if (pathname.startsWith('/dashboard/templates/create')) {
    return <div className="bg-editor-dark">{children}</div>;
  }

  // Let other pages within this segment (if any) use a default rendering
  return <>{children}</>;
}

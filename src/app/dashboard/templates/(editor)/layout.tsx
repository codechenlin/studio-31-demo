
"use client"

import React from 'react';

// This layout ensures that the children (the create page) are rendered in a full-screen "canvas" mode
// without inheriting the main dashboard layout (sidebar, header, etc.).
export default function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="bg-editor-dark">{children}</div>;
}

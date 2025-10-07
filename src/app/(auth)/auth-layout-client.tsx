
"use client";

import React from "react";
import { LanguageToggle } from "@/components/common/language-toggle";
import { ThemeToggle } from "@/components/common/theme-toggle";

export default function AuthLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <div className="min-h-screen bg-background overflow-hidden relative">
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
        </div>
        {children}
      </div>
  );
}

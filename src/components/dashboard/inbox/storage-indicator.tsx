
"use client";

import React from 'react';
import { Database } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface StorageIndicatorProps {
  used: number;
  total: number;
}

export function StorageIndicator({ used, total }: StorageIndicatorProps) {
  const percentage = (used / total) * 100;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" className="w-48 h-auto flex-col items-stretch p-2 space-y-2 cursor-pointer bg-transparent hover:bg-transparent">
              <div className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <div className="relative">
                    <Database className="size-4" />
                    <div className="absolute inset-0 bg-primary/30 rounded-full animate-pulse" style={{filter: 'blur(3px)'}}/>
                  </div>
                  <span>Almacenamiento</span>
                </div>
                <span className="font-bold text-foreground">{percentage.toFixed(0)}%</span>
              </div>
              <Progress value={percentage} className="h-4" indicatorClassName="animate-progress-scan" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
            <p>{used} GB usados de {total} GB</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

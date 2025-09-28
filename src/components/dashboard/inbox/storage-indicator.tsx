
"use client";

import React from 'react';
import { HardDrive } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StorageIndicatorProps {
    used: number;
    total: number;
}

export function StorageIndicator({ used, total }: StorageIndicatorProps) {
    const percentage = total > 0 ? (used / total) * 100 : 0;
    const circumference = 2 * Math.PI * 45; // 45 is the radius
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    const getArcColor = (percent: number) => {
        if (percent > 90) return 'hsl(var(--destructive))';
        if (percent > 70) return 'hsl(var(--chart-4))';
        return 'hsl(var(--primary))';
    };

    const arcColor = getArcColor(percentage);

    return (
        <div className="w-64 h-24 rounded-lg bg-card/80 border border-border/50 backdrop-blur-sm p-3 flex items-center gap-3">
            <div className="relative size-20">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                    {/* Background track */}
                    <circle
                        className="stroke-current text-muted/20"
                        strokeWidth="8"
                        cx="50"
                        cy="50"
                        r="45"
                        fill="transparent"
                    />
                    {/* Progress arc */}
                    <circle
                        className="stroke-current transition-all duration-500 ease-out"
                        strokeWidth="8"
                        cx="50"
                        cy="50"
                        r="45"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={circumference}
                        strokeLinecap="round"
                        transform="rotate(-90 50 50)"
                        style={{
                            strokeDashoffset: strokeDashoffset,
                            color: arcColor,
                            animation: 'arc-draw 1.5s ease-out forwards',
                            filter: `drop-shadow(0 0 5px ${arcColor})`
                        }}
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-foreground drop-shadow-lg hud-glitch" data-text={`${Math.round(percentage)}%`}>{Math.round(percentage)}%</span>
                </div>
            </div>
            <div className="flex-1 text-left">
                <p className="text-sm font-semibold text-foreground flex items-center gap-1">
                    <HardDrive className="size-4" />
                    ALMACENAMIENTO
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                    <span className="font-bold text-foreground">{used.toFixed(1)} GB</span> de {total} GB usados
                </p>
            </div>
        </div>
    );
}

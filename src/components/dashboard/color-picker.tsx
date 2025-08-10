
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Paintbrush } from 'lucide-react';

type ColorPickerProps = {
  color: string;
  setColor: (color: string) => void;
};

const presetColors = [
  "#FF6B6B", "#FFD93D", "#6BCB77", "#4D96FF", "#F7A4A4",
  "#FFAD60", "#96E072", "#64C5FF", "#B1AFFF", "#FF9E9E",
  "#3b82f6", "#10b981", "#f97316", "#8b5cf6", "#ec4899",
  "#6366f1", "#0ea5e9", "#f59e0b", "#ef4444", "#14b8a6",
];

export function ColorPicker({ color, setColor }: ColorPickerProps) {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-10 gap-1">
        {presetColors.map((preset) => (
          <button
            key={preset}
            type="button"
            className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${
              color.toLowerCase() === preset.toLowerCase() ? 'border-foreground' : 'border-transparent'
            }`}
            style={{ backgroundColor: preset }}
            onClick={() => setColor(preset)}
          />
        ))}
      </div>
      <div className="relative">
        <Paintbrush className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          type="text"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          placeholder="#FFFFFF"
          className="pl-10"
        />
        <div
          className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
}

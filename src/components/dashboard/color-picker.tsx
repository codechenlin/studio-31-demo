
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
  '#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#A133FF',
  '#33FFA1', '#FF7F50', '#6A5ACD', '#00CED1', '#FFD700',
  '#FF4500', '#2E8B57', '#4682B4', '#DA70D6', '#8A2BE2',
  '#00FF7F', '#DC143C', '#1E90FF', '#9932CC', '#FF1493',
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
          placeholder="#A020F0"
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

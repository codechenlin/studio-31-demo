
"use client";

import React from 'react';
import { HexColorPicker, HexColorInput } from "react-colorful";
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Paintbrush } from 'lucide-react';

type ColorPickerAdvancedProps = {
  color: string;
  setColor: (color: string) => void;
  className?: string;
};

export function ColorPickerAdvanced({ color, setColor, className }: ColorPickerAdvancedProps) {
  return (
     <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className={cn("w-full justify-start text-left font-normal", className)}>
          <div className="flex items-center gap-2">
            <div
              className="h-4 w-4 rounded-full border border-border"
              style={{ backgroundColor: color }}
            />
            <div className="flex-1 truncate">{color}</div>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 border-none">
        <div className="p-4 bg-card rounded-md shadow-lg">
          <HexColorPicker color={color} onChange={setColor} />
          <div className="mt-4">
             <HexColorInput prefixed alpha color={color} onChange={setColor} className="w-full p-2 border border-input rounded-md bg-background" />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}


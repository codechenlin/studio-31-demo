
"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const images = [
  { id: 1, src: 'https://picsum.photos/seed/ui1/800/1200', hint: 'dashboard ui' },
  { id: 2, src: 'https://picsum.photos/seed/ui2/800/600', hint: 'analytics chart' },
  { id: 3, src: 'https://picsum.photos/seed/ui3/800/600', hint: 'email editor' },
  { id: 4, src: 'https://picsum.photos/seed/ui4/800/1200', hint: 'user profile' },
  { id: 5, src: 'https://picsum.photos/seed/ui5/800/600', hint: 'dark mode' },
];

export function ImageGrid() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const gridContainerVariants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    initial: { opacity: 0, scale: 0.95, y: 20 },
    animate: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  return (
    <motion.div 
      className="relative w-full max-w-2xl p-2 rounded-2xl bg-zinc-900/50 border border-primary/20"
      variants={gridContainerVariants}
      initial="initial"
      animate="animate"
    >
        <div 
            className="absolute -inset-0.5 -z-10 rounded-xl bg-gradient-to-r from-primary via-accent to-primary opacity-20 blur-lg"
        />
        <div className="grid grid-cols-4 grid-rows-3 gap-2 md:gap-4 h-[60vh] max-h-[700px]">
            {images.map((image, index) => {
                const isMain = index === 0;
                const isSide1 = index === 1;
                const isSide2 = index === 2;
                const isBottom1 = index === 3;
                const isBottom2 = index === 4;

                return (
                    <motion.div
                        key={image.id}
                        className={cn(
                            'relative rounded-lg overflow-hidden group',
                            isMain && 'col-span-2 row-span-3',
                            isSide1 && 'col-span-2 row-span-1',
                            isSide2 && 'col-span-2 row-span-2',
                            isBottom1 && 'col-span-2 row-span-3',
                            isBottom2 && 'col-span-2 row-span-1'
                        )}
                        variants={itemVariants}
                        onMouseEnter={() => !isMain && setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                    >
                        <Image
                            src={image.src}
                            alt={`UI screenshot ${image.id}`}
                            fill
                            className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                            data-ai-hint={image.hint}
                            sizes="(max-width: 768px) 50vw, 33vw"
                        />
                         <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                    </motion.div>
                );
            })}
        </div>
    </motion.div>
  );
}

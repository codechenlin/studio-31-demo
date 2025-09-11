
"use client";

import React, { useRef } from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { cn } from "@/lib/utils";

const images = [
  {
    src: "https://picsum.photos/seed/1/1200/1800",
    alt: "Abstract 3D render of financial charts",
    aiHint: "3d finance",
  },
  {
    src: "https://picsum.photos/seed/2/1200/1800",
    alt: "Person managing finances on a laptop",
    aiHint: "finance management",
  },
  {
    src: "https://picsum.photos/seed/3/1200/1800",
    alt: "Data visualization with glowing nodes",
    aiHint: "data nodes",
  },
];

export function ImageCarousel() {
  const plugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: false }));

  return (
    <div className="flex w-full max-w-md flex-col items-center justify-center text-center text-white">
        <div className="relative w-full aspect-[3/4] mb-8 rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
            <Image 
                src="https://picsum.photos/seed/person/600/800"
                alt="Manage your money anywhere"
                fill
                className="object-cover"
                data-ai-hint="finance management"
            />
             <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent"/>
        </div>
      
      <h2 className="text-3xl font-bold">Gestiona tu Dinero Donde Sea</h2>
      <p className="text-zinc-400 mt-2">
        Puedes gestionar tu dinero sobre la marcha con Quicken en la web.
      </p>
      
      <div className="w-full mt-8">
        <Carousel
          plugins={[plugin.current]}
          className="w-full"
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent className="-ml-2">
            {images.map((image, index) => (
              <CarouselItem key={index} className="pl-2 basis-1/3">
                <div className="p-1">
                   <div className="relative aspect-square w-full rounded-lg overflow-hidden border-2 border-zinc-800/80 hover:border-primary/50 transition-colors">
                     <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover"
                      data-ai-hint={image.aiHint}
                    />
                   </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
}

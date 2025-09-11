
"use client";

import React from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { BrainCircuit, Bot, Target, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: BrainCircuit,
    title: "Análisis Predictivo",
    description: "Anticipa las necesidades de tus clientes y personaliza su experiencia.",
    img: "https://picsum.photos/seed/ai1/800/1200",
    aiHint: "abstract neural network",
  },
  {
    icon: Target,
    title: "Segmentación Autónoma",
    description: "Crea audiencias dinámicas basadas en el comportamiento en tiempo real.",
    img: "https://picsum.photos/seed/ai2/800/1200",
    aiHint: "glowing data nodes",
  },
  {
    icon: Zap,
    title: "Optimización de Campañas",
    description: "La IA ajusta automáticamente tus envíos para maximizar el impacto.",
    img: "https://picsum.photos/seed/ai3/800/1200",
    aiHint: "futuristic data chart",
  },
];

export function AiFeatureCarousel() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on("select", onSelect);

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <div className="w-full max-w-lg mx-auto">
       <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-primary/20 bg-zinc-900/50 p-4 shadow-2xl shadow-primary/10">
        <div className="w-full h-full relative">
            <div className="absolute inset-0 bg-grid-zinc-800/20 [mask-image:linear-gradient(to_bottom,white_50%,transparent_100%)]" />

            <Carousel
                setApi={setApi}
                plugins={[Autoplay({ delay: 4000, stopOnInteraction: false })]}
                className="w-full h-full"
                opts={{ loop: true }}
            >
                <CarouselContent>
                {features.map((feature, index) => (
                    <CarouselItem key={index}>
                    <div className="w-full h-full flex items-center justify-center">
                         <Image
                            src={feature.img}
                            alt={feature.title}
                            fill
                            className="object-cover opacity-10 transition-opacity duration-500"
                            data-ai-hint={feature.aiHint}
                        />
                    </div>
                    </CarouselItem>
                ))}
                </CarouselContent>
            </Carousel>
        </div>
      </div>
      
      <div className="mt-6">
        <div className="grid grid-cols-3 gap-2 md:gap-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isActive = current === index;
            return (
              <div
                key={index}
                className={cn(
                  "relative p-4 rounded-lg bg-zinc-800/50 border border-zinc-700/80 transition-all duration-500 overflow-hidden",
                  isActive ? "border-primary/80" : ""
                )}
              >
                <div className="relative z-10">
                    <Icon className={cn("size-7 mb-2 transition-colors", isActive ? "text-primary": "text-zinc-500")} />
                    <h3 className={cn("font-bold text-sm md:text-base transition-colors", isActive ? "text-white" : "text-zinc-300")}>{feature.title}</h3>
                    <p className="text-zinc-400 text-xs md:text-sm mt-1">{feature.description}</p>
                </div>

                <div 
                    className={cn(
                        "absolute top-0 left-0 h-full w-2 bg-primary/80 transition-all duration-500",
                        "shadow-[0_0_15px_2px_hsl(var(--primary))] animate-pulse",
                        isActive ? "opacity-100" : "opacity-0"
                    )}
                    style={{
                        animationDuration: '2s'
                    }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

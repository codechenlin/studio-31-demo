
"use client";

import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { BrainCircuit, Loader, Save, UploadCloud, Hourglass } from 'lucide-react';
import { cn } from '@/lib/utils';

type LoadingModalVariant = 'generate' | 'save' | 'upload' | 'login';

const variantConfig = {
  generate: {
    icon: BrainCircuit,
    title: "La IA está pensando",
    description: "Analizando patrones y generando insights para ti.",
    animation: "animate-pulse"
  },
  save: {
    icon: Save,
    title: "Guardando Cambios",
    description: "Tu trabajo está siendo almacenado de forma segura.",
    animation: "animate-pulse"
  },
  upload: {
    icon: UploadCloud,
    title: "Subiendo Archivo",
    description: "Por favor espera mientras tu archivo se sube a la nube.",
     animation: "animate-pulse"
  },
  login: {
    icon: Loader,
    title: "Iniciando Sesión",
    description: "Verificando tus credenciales. Un momento...",
    animation: "animate-rotate-back-and-forth"
  },
  default: {
    icon: Hourglass,
    title: 'Procesando',
    description: 'Por favor, espera un momento...',
     animation: "animate-pulse"
  }
};

interface LoadingModalProps {
  isOpen: boolean;
  variant?: LoadingModalVariant | string; // Allow string for flexibility, but handle fallback
}

export function LoadingModal({ isOpen, variant = 'generate' }: LoadingModalProps) {
  const config = variantConfig[variant as keyof typeof variantConfig] || variantConfig.default;
  const { icon: Icon, title, description, animation } = config;

  return (
    <Dialog open={isOpen}>
      <DialogContent 
        className="sm:max-w-md bg-card/80 backdrop-blur-sm border-none p-0 overflow-hidden"
        showCloseButton={false}
      >
        <style>{`
            @keyframes rotate-back-and-forth {
                0% { transform: rotate(0deg); }
                50% { transform: rotate(360deg); }
                100% { transform: rotate(0deg); }
            }
            .animate-rotate-back-and-forth {
                animation: rotate-back-and-forth 2.5s ease-in-out infinite;
            }
            @keyframes indeterminate-progress {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
            }
            .animate-indeterminate-progress {
                animation: indeterminate-progress 1.5s infinite ease-in-out;
            }
        `}</style>
        <div className="p-8 text-center flex flex-col items-center">
          <Icon className={cn("size-16 text-primary mb-4", animation)} />
          <DialogTitle className="text-xl">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </div>
        <div className="h-2 w-full bg-primary/20 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary to-accent animate-indeterminate-progress"></div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

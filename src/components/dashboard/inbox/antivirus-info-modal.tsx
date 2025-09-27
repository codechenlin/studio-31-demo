
"use client";

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Shield, CheckCircle, BrainCircuit, CheckCheck } from 'lucide-react';
import { motion } from 'framer-motion';

interface AntivirusInfoModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const techItems = [
    { name: "Análisis Heurístico", info: "Detecta troyanos, virus y malware." },
    { name: "Inteligencia de Amenazas", info: "Actualizaciones diarias contra nuevas amenazas." },
    { name: "Escaneo Profundo de Adjuntos", info: "Inspección a nivel binario de todos los archivos." },
    { name: "Arquitectura Aislada", info: "Las amenazas se neutralizan en un entorno seguro." }
];

const Particle = () => {
    const style: React.CSSProperties = {
      '--size': `${Math.random() * 2 + 1}px`,
      '--x-start': `${Math.random() * 100}%`,
      '--y-start': `${Math.random() * 100}%`,
      '--x-end': `${Math.random() * 200 - 50}%`,
      '--y-end': `${Math.random() * 200 - 50}%`,
      '--duration': `${Math.random() * 8 + 6}s`,
      '--delay': `-${Math.random() * 14}s`,
      '--color-group': Math.random() > 0.5 ? '#1700E6' : '#009AFF'
    } as any;
    return <div className="particle" style={style} />;
};

export function AntivirusInfoModal({ isOpen, onOpenChange }: AntivirusInfoModalProps) {

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-full h-[500px] flex p-0 gap-0 bg-zinc-900/90 backdrop-blur-2xl border-2 border-blue-500/30 text-white overflow-hidden" showCloseButton={false}>
          <style>{`
            @keyframes particle-move {
              0% { transform: translate(var(--x-start), var(--y-start)); opacity: 1; }
              100% { transform: translate(var(--x-end), var(--y-end)); opacity: 0; }
            }
            .particle {
              position: absolute;
              width: var(--size);
              height: var(--size);
              background: var(--color-group);
              border-radius: 50%;
              animation: particle-move var(--duration) var(--delay) linear infinite;
              will-change: transform, opacity;
            }
          `}</style>
        <div className="grid grid-cols-1 md:grid-cols-2 h-full">
            <div className="relative h-full w-full bg-black/30 flex flex-col items-center justify-center p-8 overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
                    {Array.from({ length: 50 }).map((_, i) => <Particle key={i} />)}
                </div>
                <motion.div 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 150, damping: 20 }}
                    className="relative z-10 flex flex-col items-center text-center gap-6"
                >
                    <div className="relative p-4 rounded-full bg-blue-900/50 border-2 border-blue-500/50 mb-4">
                       <Shield className="text-blue-300 size-12" />
                       <div className="absolute inset-0 rounded-full animate-ping border-2 border-blue-400/50" />
                    </div>
                    <h2 className="text-3xl font-bold text-white">Sistema Activo</h2>
                    <p className="text-blue-200/70 text-lg">Protección en Tiempo Real</p>
                    <div className="p-3 rounded-lg bg-gradient-to-r from-[#00CE07]/20 to-[#A6EE00]/20 border border-[#00CE07]/50 flex items-center gap-3">
                        <CheckCheck className="size-6 text-[#A6EE00]"/>
                        <span className="font-semibold text-white">Sistema Activo</span>
                    </div>
                    <Button 
                        onClick={() => onOpenChange(false)} 
                        className="w-full bg-blue-800 hover:bg-blue-700 text-white"
                      >
                        Entendido
                      </Button>
                </motion.div>
            </div>

            <div className="flex flex-col h-full p-8">
                <DialogHeader className="text-left">
                    <DialogTitle className="text-2xl font-bold text-blue-300">
                        Escudo de Seguridad de IA
                    </DialogTitle>
                    <DialogDescription className="text-blue-200/70">
                        Tu sistema está protegido activamente contra virus, troyanos y malware.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex-1 mt-4 space-y-4">
                    <div className='p-3 bg-green-500/10 border border-green-400/20 rounded-lg'>
                        <h4 className='font-bold text-green-300'>Análisis de este correo:</h4>
                        <p className='text-sm text-green-200/90'>No se han detectado amenazas en este correo electrónico.</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg text-white/90 mb-2 flex items-center gap-2"><BrainCircuit/>Tecnologías Activas</h3>
                        <ul className="space-y-2">
                          {techItems.map((item, index) => (
                            <motion.li
                                key={item.name}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.15 + 0.3 }}
                                className="flex items-start gap-3 text-sm"
                            >
                                <CheckCircle className="size-5 text-blue-400 mt-0.5 shrink-0" />
                                <div>
                                    <h4 className="font-semibold text-white">{item.name}</h4>
                                    <p className="text-xs text-white/60">{item.info}</p>
                                </div>
                            </motion.li>
                          ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

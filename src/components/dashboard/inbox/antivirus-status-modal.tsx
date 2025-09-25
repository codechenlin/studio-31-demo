
"use client";

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Shield, Server, CheckCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface AntivirusStatusModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const techItems = [
    { name: "Motor ClamAV", info: "Utilizamos el potente motor de código abierto ClamAV para detectar troyanos, virus, malware y otras amenazas maliciosas." },
    { name: "Actualizaciones en Tiempo Real", info: "La base de datos de firmas de virus se actualiza constantemente para protegerte contra las amenazas más recientes." },
    { name: "Escaneo de Adjuntos", info: "Cada archivo adjunto en los correos entrantes puede ser escaneado para verificar su seguridad antes de que lo descargues." },
    { name: "Aislamiento en Docker", info: "El servicio se ejecuta en un contenedor Docker aislado, asegurando que cualquier posible amenaza esté contenida y no afecte tu sistema." }
];

export function AntivirusStatusModal({ isOpen, onOpenChange }: AntivirusStatusModalProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl bg-zinc-900/90 backdrop-blur-2xl border-2 border-blue-500/20 text-white overflow-hidden" showCloseButton={false}>
        <div className="absolute inset-0 z-0 opacity-20">
           <div className="absolute inset-0 bg-grid-blue-500/30 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"/>
        </div>
         <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-500/20 rounded-full animate-pulse-slow filter blur-3xl -translate-x-1/2 -translate-y-1/2"/>

        <DialogHeader className="z-10 text-center pt-8">
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 20 }}
            className="flex justify-center mb-4"
          >
            <div className="relative p-4 rounded-full bg-blue-900/50 border-2 border-blue-500/50">
               <Shield className="text-blue-300 size-10" />
               <div className="absolute inset-0 rounded-full animate-ping border-2 border-blue-400/50" />
            </div>
          </motion.div>
          <DialogTitle className="text-3xl font-bold">
            Sistema Antivirus Activo
          </DialogTitle>
          <DialogDescription className="text-blue-200/70 text-lg">
            Estás protegido por nuestro escudo de seguridad ClamAV.
          </DialogDescription>
        </DialogHeader>

        <div className="py-6 z-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-lg bg-black/30 border border-blue-400/20 space-y-4">
                <h3 className="font-semibold text-lg text-blue-300 flex items-center gap-2"><Server /> Estado del Servicio</h3>
                 <div className="flex items-center gap-3 p-3 rounded-md bg-green-500/10 border border-green-400/20">
                    <div className="relative flex items-center justify-center">
                        <div className="absolute w-full h-full bg-green-500/30 rounded-full animate-ping"/>
                        <CheckCircle className="size-5 text-green-400" />
                    </div>
                    <span className="text-sm font-medium text-white/90">Operativo</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-md bg-gray-500/10 border border-gray-400/20">
                    <Clock className="size-5 text-gray-400" />
                    <span className="text-sm font-medium text-white/90">
                        {isClient ? `Activo desde: ${new Date().toLocaleDateString()}` : 'Cargando...'}
                    </span>
                </div>
            </div>
             <div className="space-y-4 p-6 rounded-lg bg-black/30 border border-blue-400/20">
                <h3 className="font-semibold text-lg text-blue-300">Funciones Principales</h3>
                 <ul className="space-y-3">
                  {techItems.map((item, index) => (
                    <motion.li
                        key={item.name}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.15 + 0.5 }}
                        className="flex items-start gap-3"
                    >
                        <CheckCircle className="size-5 text-blue-400 mt-0.5 shrink-0" />
                        <p className="text-sm text-white/80">{item.info}</p>
                    </motion.li>
                  ))}
                </ul>
            </div>
        </div>

        <DialogFooter className="z-10 pt-4">
          <Button 
            onClick={() => onOpenChange(false)} 
            className="text-white bg-blue-800 hover:bg-blue-700"
          >
            Entendido
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

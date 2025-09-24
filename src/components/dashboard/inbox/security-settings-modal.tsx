
"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Shield, User, Users, Globe, X, Mail, CheckCircle, Search, ArrowRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Input } from '@/components/ui/input';

interface SecuritySettingsModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

type Step = 'initial' | 'specific' | 'multiple' | 'all';

export function SecuritySettingsModal({ isOpen, onOpenChange }: SecuritySettingsModalProps) {
  const [step, setStep] = useState<Step>('initial');

  const handleClose = () => {
    onOpenChange(false);
    // Reset state after a short delay to allow for exit animation
    setTimeout(() => {
      setStep('initial');
    }, 300);
  };
  
  const cardVariants = {
    initial: { opacity: 0, y: 30, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2, type: "spring", stiffness: 100 } },
    exit: { opacity: 0, y: -30, scale: 0.95 },
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  const renderInitialStep = () => (
    <motion.div
      key="initial"
      variants={cardVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="grid grid-cols-1 md:grid-cols-3 gap-6"
    >
      {[
        { step: 'specific', title: 'Dirección Única', desc: 'Aplicar a un remitente específico.', icon: User },
        { step: 'multiple', title: 'Múltiples Direcciones', desc: 'Seleccionar varios remitentes.', icon: Users },
        { step: 'all', title: 'Todos los Correos', desc: 'Aplicar a todos los correos entrantes.', icon: Globe },
      ].map(item => (
         <motion.div variants={itemVariants} key={item.step}>
            <button
              onClick={() => setStep(item.step as Step)}
              className="group relative p-6 rounded-2xl border-2 border-primary/10 bg-black/20 w-full h-full text-center transition-all duration-300 hover:border-primary/50 hover:bg-primary/10 hover:shadow-2xl hover:shadow-primary/20"
            >
                <div className="absolute inset-0 bg-grid-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                    <item.icon className="mx-auto size-12 text-primary mb-4 transition-transform group-hover:scale-110" />
                    <h3 className="font-bold text-lg text-white">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
                </div>
            </button>
         </motion.div>
      ))}
    </motion.div>
  );

  const renderSecondaryStep = (title: string, description: string) => (
    <motion.div
        key={step}
        variants={cardVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="text-center"
    >
        <div className="relative inline-block">
            <div className="p-4 bg-green-500/20 rounded-full border-4 border-green-500/30">
                <CheckCircle className="mx-auto size-16 text-green-400" style={{filter: 'drop-shadow(0 0 10px #34d399)'}}/>
            </div>
        </div>
        <h3 className="text-xl font-semibold text-white mt-4">Opción Seleccionada: {title}</h3>
        <p className="text-muted-foreground mt-2">{description}</p>
        
        <div className="mt-6 text-left max-w-lg mx-auto">
            {step === 'specific' && (
                 <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input placeholder="Introduce la dirección de correo..." className="pl-10 bg-black/20 border-primary/30 focus:border-primary focus:ring-primary" />
                </div>
            )}
            {step === 'multiple' && (
                 <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input placeholder="Busca o añade direcciones..." className="pl-10 bg-black/20 border-accent/30 focus:border-accent focus:ring-accent" />
                </div>
            )}
             {step === 'all' && (
                 <p className="text-center bg-primary/10 p-4 rounded-lg border border-primary/20 text-primary-foreground/80">La configuración se aplicará a todos los correos entrantes.</p>
            )}
        </div>
    </motion.div>
  );

  const stepContent = {
    initial: renderInitialStep(),
    specific: renderSecondaryStep("Dirección Única", "Aquí podrás introducir la dirección de correo específica."),
    multiple: renderSecondaryStep("Múltiples Direcciones", "Aquí podrás añadir o seleccionar varias direcciones de tu historial."),
    all: renderSecondaryStep("Todos los Correos", "La configuración de seguridad se aplicará globalmente.")
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl bg-zinc-900/80 backdrop-blur-xl border-blue-500/20 text-white overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="absolute h-full w-full bg-grid-blue-500/30 [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
        </div>
         <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-500/20 rounded-full animate-pulse-slow filter blur-3xl -translate-x-1/2 -translate-y-1/2"/>

        <DialogHeader className="z-10">
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <Shield className="text-blue-400"/>
            Configuración de Privacidad Avanzada
          </DialogTitle>
          <DialogDescription className="text-blue-200/70">
            Protege tu privacidad bloqueando imágenes y rastreadores en tus correos. Elige cómo deseas aplicar esta configuración.
          </DialogDescription>
        </DialogHeader>

        <div className="py-6 min-h-[250px] flex items-center justify-center z-10">
            <AnimatePresence mode="wait">
                {stepContent[step]}
            </AnimatePresence>
        </div>

        <DialogFooter className="z-10">
            {step !== 'initial' && (
                <Button variant="ghost" onClick={() => setStep('initial')}>Atrás</Button>
            )}
            <Button variant="outline" onClick={handleClose}>Cerrar</Button>
            {step !== 'initial' && (
                 <Button className="bg-gradient-to-r from-primary to-accent text-white hover:opacity-90">Guardar Configuración <ArrowRight className="ml-2"/></Button>
            )}
        </DialogFooter>
         <Button variant="ghost" size="icon" className="absolute top-4 right-4 z-20" onClick={handleClose}>
            <X />
        </Button>
      </DialogContent>
    </Dialog>
  );
}

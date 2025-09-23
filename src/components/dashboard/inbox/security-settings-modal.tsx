
"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Shield, User, Users, Globe, X, Mail, CheckCircle, Search } from 'lucide-react';
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
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
    exit: { opacity: 0, y: -20 },
  };

  const itemVariants = {
    initial: { opacity: 0, y: 10 },
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
      <motion.button
        variants={itemVariants}
        onClick={() => setStep('specific')}
        className="group relative p-6 rounded-xl border border-primary/20 bg-primary/10 hover:bg-primary/20 text-center transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/20"
      >
        <User className="mx-auto size-12 text-primary mb-4 transition-transform group-hover:scale-110" />
        <h3 className="font-semibold text-lg">Dirección Única</h3>
        <p className="text-sm text-muted-foreground mt-1">Aplicar a un remitente específico.</p>
      </motion.button>
      <motion.button
        variants={itemVariants}
        onClick={() => setStep('multiple')}
        className="group relative p-6 rounded-xl border border-accent/20 bg-accent/10 hover:bg-accent/20 text-center transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-accent/20"
      >
        <Users className="mx-auto size-12 text-accent mb-4 transition-transform group-hover:scale-110" />
        <h3 className="font-semibold text-lg">Múltiples Direcciones</h3>
        <p className="text-sm text-muted-foreground mt-1">Seleccionar varios remitentes.</p>
      </motion.button>
      <motion.button
        variants={itemVariants}
        onClick={() => setStep('all')}
        className="group relative p-6 rounded-xl border-border/50 bg-muted/30 hover:bg-muted/50 text-center transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-muted-foreground/10"
      >
        <Globe className="mx-auto size-12 text-muted-foreground mb-4 transition-transform group-hover:scale-110" />
        <h3 className="font-semibold text-lg">Todos los Correos</h3>
        <p className="text-sm text-muted-foreground mt-1">Aplicar a todos los correos entrantes.</p>
      </motion.button>
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
        <CheckCircle className="mx-auto size-16 text-green-500 mb-4"/>
        <h3 className="text-xl font-semibold">Opción Seleccionada: {title}</h3>
        <p className="text-muted-foreground mt-2">{description}</p>
        
        <div className="mt-6 text-left max-w-lg mx-auto">
            {step === 'specific' && (
                 <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input placeholder="Introduce la dirección de correo..." className="pl-10" />
                </div>
            )}
            {step === 'multiple' && (
                 <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input placeholder="Busca o añade direcciones..." className="pl-10" />
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
      <DialogContent className="max-w-4xl bg-card/80 backdrop-blur-xl border-primary/20 shadow-primary/10 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <Shield className="text-primary"/>
            Configuración de Privacidad Avanzada
          </DialogTitle>
          <DialogDescription>
            Protege tu privacidad bloqueando imágenes y rastreadores en tus correos. Elige cómo deseas aplicar esta configuración.
          </DialogDescription>
        </DialogHeader>

        <div className="py-6 min-h-[250px] flex items-center justify-center">
            <AnimatePresence mode="wait">
                {stepContent[step]}
            </AnimatePresence>
        </div>

        <DialogFooter>
            {step !== 'initial' && (
                <Button variant="ghost" onClick={() => setStep('initial')}>Atrás</Button>
            )}
            <Button variant="outline" onClick={handleClose}>Cerrar</Button>
            {step !== 'initial' && (
                 <Button>Guardar Configuración</Button>
            )}
        </DialogFooter>
         <Button variant="ghost" size="icon" className="absolute top-4 right-4" onClick={handleClose}>
            <X />
        </Button>
      </DialogContent>
    </Dialog>
  );
}

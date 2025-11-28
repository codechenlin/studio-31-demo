"use client";

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PlayCircle, Hourglass, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { type Domain } from './types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

const CountdownTimer = ({ expiryDate }: { expiryDate: Date }) => {
    const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = expiryDate.getTime() - now;

            if (distance < 0) {
                setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
                clearInterval(timer);
            } else {
                setTimeLeft({
                    hours: Math.floor(distance / (1000 * 60 * 60)),
                    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((distance % (1000 * 60)) / 1000),
                });
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [expiryDate]);
    
    return (
        <div className="flex items-center gap-2 font-mono text-sm text-amber-200">
            <Hourglass className="size-4 text-amber-400" />
            <span>
              {String(timeLeft.hours).padStart(2, '0')}:
              {String(timeLeft.minutes).padStart(2, '0')}:
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
        </div>
    );
};

interface PausedProcessListModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  pausedProcesses: Domain[];
  onSelectDomain: (domain: Domain) => void;
}

export function PausedProcessListModal({ isOpen, onOpenChange, pausedProcesses, onSelectDomain }: PausedProcessListModalProps) {

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl bg-zinc-900/90 backdrop-blur-xl border border-primary/20 text-white overflow-hidden" showCloseButton={false}>
                <div className="absolute inset-0 z-0 opacity-10 bg-grid-primary/20 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"/>
                
                <DialogHeader className="z-10 p-6 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="relative p-3 rounded-full bg-primary/20 border-2 border-primary/30">
                            <motion.div
                                className="absolute inset-0 rounded-full border-4 border-dashed border-accent/50"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                            />
                            <PlayCircle className="relative size-12 text-primary" style={{ filter: 'drop-shadow(0 0 10px hsl(var(--primary)))' }}/>
                        </div>
                    </div>
                    <DialogTitle className="text-2xl font-bold">Procesos Pausados</DialogTitle>
                    <DialogDescription className="text-primary-foreground/70 pt-2">
                        Selecciona un dominio para continuar con el proceso de verificación donde lo dejaste.
                    </DialogDescription>
                </DialogHeader>

                <div className="z-10 h-80 px-6 pb-6">
                    <ScrollArea className="h-full custom-scrollbar pr-4 -mr-4">
                        <motion.div layout className="space-y-3">
                            <AnimatePresence>
                                {pausedProcesses.map((process, index) => {
                                     const expiryDate = new Date(new Date(process.dns_checks?.updated_at || process.created_at).getTime() + 48 * 60 * 60 * 1000);
                                    return (
                                        <motion.div
                                            key={process.id}
                                            layout
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0, transition: { delay: index * 0.1 } }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="group p-4 rounded-lg border border-primary/20 bg-black/30 flex items-center justify-between gap-4 transition-all hover:bg-primary/10 hover:border-primary/40"
                                        >
                                            <div className="flex items-center gap-3">
                                                <Globe className="size-5 text-primary/80"/>
                                                <span className="font-semibold text-base">{process.domain_name}</span>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <CountdownTimer expiryDate={expiryDate} />
                                                <Button
                                                    size="sm"
                                                    onClick={() => onSelectDomain(process)}
                                                    className="bg-primary/80 text-white hover:bg-primary"
                                                >
                                                    <PlayCircle className="mr-2"/>
                                                    Continuar
                                                </Button>
                                            </div>
                                        </motion.div>
                                    )
                                })}
                            </AnimatePresence>
                        </motion.div>
                    </ScrollArea>
                </div>
            </DialogContent>
        </Dialog>
    );
}

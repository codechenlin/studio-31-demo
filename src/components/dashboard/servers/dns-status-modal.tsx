
"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle, ShieldCheck, Dna, Bot, Shield, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DnsAnalysisModal } from './dns-analysis-modal';

type ProviderStatus = 'ok' | 'error';

interface DnsStatusModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  status: ProviderStatus | null;
}

const mockOkDomains = [
    { name: 'mailflow.ai', status: 'ok' },
    { name: 'marketingpro.com', status: 'ok' },
    { name: 'leads.mydomain.org', status: 'ok' },
    { name: 'notifications.app.net', status: 'ok' },
    { name: 'sales-updates.co', status: 'ok' },
];

const mockErrorDomains = [
    { name: 'mailflow.ai', status: 'ok' },
    { name: 'analytics.data.info', status: 'error' },
    { name: 'customer-service.io', status: 'ok' },
    { name: 'my-other-domain.com', status: 'error' },
    { name: 'test-env.dev', status: 'ok' },
];

export function DnsStatusModal({ isOpen, onOpenChange, status }: DnsStatusModalProps) {
    const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
    const [selectedDomain, setSelectedDomain] = useState<string | null>(null);

    const handleAnalyzeDomain = (domain: string) => {
        setSelectedDomain(domain);
        setIsAnalysisModalOpen(true);
    };

    if (!status) return null;

    if(status === 'ok') {
        return (
            <Dialog open={isOpen} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-4xl w-full h-[600px] flex flex-col p-0 gap-0 bg-zinc-900/90 backdrop-blur-2xl border-2 border-green-500/30 text-white overflow-hidden" showCloseButton={false}>
                    <div className="grid grid-cols-1 md:grid-cols-2 h-full">
                        {/* Left Panel */}
                        <div className="relative h-full w-full bg-black/30 flex flex-col items-center justify-center p-8 overflow-hidden">
                             <div className="absolute inset-0 bg-grid-green-500/20 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
                            <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 150, damping: 20 }} className="relative z-10 flex flex-col items-center text-center">
                                <ShieldCheck className="size-20 text-green-400 mb-4" style={{ filter: 'drop-shadow(0 0 15px #00CB07)' }}/>
                                <h2 className="text-3xl font-bold text-white">Todo en Orden</h2>
                                <p className="text-green-200/70 text-lg mt-1">Todos tus dominios están verificados y saludables.</p>
                            </motion.div>
                        </div>
                        {/* Right Panel */}
                        <div className="flex flex-col h-full p-8">
                            <DialogHeader className="text-left">
                                <DialogTitle className="text-2xl font-bold text-green-300">
                                    Estado del Sistema: Óptimo
                                </DialogTitle>
                                <DialogDescription className="text-green-200/70">
                                    Nuestro sistema de vigilancia neuronal monitorea tus registros DNS 24/7 para asegurar la máxima entregabilidad.
                                </DialogDescription>
                            </DialogHeader>
                            <ScrollArea className="flex-1 mt-6 -mr-4 pr-4 custom-scrollbar">
                               <ul className="space-y-3">
                                  {mockOkDomains.map((domain, index) => (
                                    <motion.li
                                        key={domain.name}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="flex items-center gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20"
                                    >
                                        <CheckCircle className="size-5 text-green-400" />
                                        <span className="font-mono text-white/90">{domain.name}</span>
                                    </motion.li>
                                  ))}
                                </ul>
                            </ScrollArea>
                            <DialogFooter className="pt-6">
                                <Button onClick={() => onOpenChange(false)} className="w-full bg-green-800 hover:bg-[#00CB07] text-white">Cerrar</Button>
                            </DialogFooter>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <>
        <DnsAnalysisModal 
            isOpen={isAnalysisModalOpen}
            onOpenChange={setIsAnalysisModalOpen}
            domain={selectedDomain}
        />
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl w-full h-[600px] flex flex-col p-0 gap-0 bg-zinc-900/90 backdrop-blur-2xl border-2 border-red-500/30 text-white overflow-hidden" showCloseButton={false}>
                <div className="grid grid-cols-1 md:grid-cols-2 h-full">
                    {/* Left Panel */}
                    <div className="relative h-full w-full bg-black/30 flex flex-col items-center justify-center p-8 overflow-hidden">
                        <div className="absolute inset-0 bg-grid-red-500/20 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
                        <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 150, damping: 20 }} className="relative z-10 flex flex-col items-center text-center">
                            <div className="relative p-4 rounded-full mb-4">
                                <AlertCircle className="text-red-400 size-20" style={{ filter: 'drop-shadow(0 0 15px #F00000)' }}/>
                                <div className="absolute inset-0 rounded-full border-4 border-red-500/50 animate-ping"/>
                            </div>
                            <h2 className="text-3xl font-bold text-white">Acción Requerida</h2>
                            <p className="text-red-200/70 text-lg mt-1">Se han detectado errores en algunos dominios.</p>
                        </motion.div>
                    </div>
                    {/* Right Panel */}
                    <div className="flex flex-col h-full p-8">
                        <DialogHeader className="text-left">
                            <DialogTitle className="text-2xl font-bold text-red-300">
                                Diagnóstico de DNS
                            </DialogTitle>
                            <DialogDescription className="text-red-200/70">
                                Algunos de tus dominios tienen configuraciones incorrectas que podrían afectar la entrega de correos.
                            </DialogDescription>
                        </DialogHeader>
                        <ScrollArea className="flex-1 mt-6 -mr-4 pr-4 custom-scrollbar">
                           <ul className="space-y-3">
                              {mockErrorDomains.map((domain, index) => (
                                <motion.li
                                    key={domain.name}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex items-center justify-between gap-3 p-3 rounded-lg border"
                                >
                                    <div className="flex items-center gap-3">
                                      {domain.status === 'ok' ? <CheckCircle className="size-5 text-green-400" /> : <AlertCircle className="size-5 text-red-400" />}
                                      <span className="font-mono text-white/90">{domain.name}</span>
                                    </div>
                                    {domain.status === 'error' && (
                                        <Button size="sm" className="h-8 bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:opacity-90" onClick={() => handleAnalyzeDomain(domain.name)}>
                                            <Bot className="mr-2" /> Analizar con IA
                                        </Button>
                                    )}
                                </motion.li>
                              ))}
                            </ul>
                        </ScrollArea>
                        <DialogFooter className="pt-6">
                            <Button onClick={() => onOpenChange(false)} className="w-full bg-red-800 hover:bg-red-700 text-white">Cerrar</Button>
                        </DialogFooter>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
        </>
    );
}

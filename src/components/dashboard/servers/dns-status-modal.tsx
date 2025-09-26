
      "use client";

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle, Bot, Shield, Loader2 } from 'lucide-react';
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
                <DialogContent className="max-w-4xl w-full h-[600px] flex p-0 gap-0 bg-zinc-900/90 backdrop-blur-2xl border-2 border-green-500/30 text-white overflow-hidden" showCloseButton={false}>
                    <style>{`
                        @keyframes pulse-glow-green {
                          0%, 100% { box-shadow: 0 0 20px 5px hsl(140 100% 50% / 0.2), 0 0 40px 10px hsl(140 100% 50% / 0.1); }
                          50% { box-shadow: 0 0 30px 10px hsl(140 100% 50% / 0.3), 0 0 50px 15px hsl(140 100% 50% / 0.2); }
                        }
                        @keyframes data-stream {
                           0% { transform: translateY(-100%); }
                           100% { transform: translateY(100%); }
                        }
                        @keyframes light-sweep {
                            0% { transform: translateY(-100%); }
                            100% { transform: translateY(100%); }
                        }
                    `}</style>
                    <div className="w-1/2 h-full flex flex-col items-center justify-center p-8 bg-black/30 relative overflow-hidden">
                        <div className="absolute inset-0 bg-grid-green-500/10 [mask-image:radial-gradient(ellipse_at_center,white_30%,transparent_100%)]" />
                        <div className="absolute inset-0 w-full h-full overflow-hidden">
                            <div className="absolute top-0 left-1/4 h-full w-px bg-gradient-to-b from-green-500/0 via-green-500/50 to-green-500/0 animate-[data-stream_8s_linear_infinite]" />
                            <div className="absolute top-0 left-3/4 h-full w-px bg-gradient-to-b from-green-500/0 via-green-500/50 to-green-500/0 animate-[data-stream_10s_linear_infinite_2s]" />
                        </div>
                        <motion.div 
                            initial={{ scale: 0.5, opacity: 0 }} 
                            animate={{ scale: 1, opacity: 1 }} 
                            transition={{ delay: 0.2, type: "spring", stiffness: 150, damping: 20 }} 
                            className="relative z-10 flex flex-col items-center text-center"
                        >
                            <div className="relative w-40 h-40 flex items-center justify-center">
                                <div className="absolute inset-0 rounded-full border-2 border-green-500/20" />
                                <div className="absolute inset-2 rounded-full border-2 border-green-500/30 animate-spin" style={{animationDuration: '10s'}}/>
                                <div className="absolute inset-4 rounded-full border-2 border-green-500/40 animate-spin" style={{animationDuration: '8s', animationDirection: 'reverse'}}/>
                                <div className="absolute inset-0 rounded-full animate-[pulse-glow-green_4s_infinite_ease-in-out]" />
                                <Shield className="size-20 text-green-400" />
                            </div>
                            <h2 className="text-3xl font-bold text-white mt-4">Todo en Orden</h2>
                            <p className="text-green-200/70 text-lg mt-1">Sistema de protección activo.</p>
                        </motion.div>
                    </div>

                    <div className="w-1/2 h-full flex flex-col p-8 bg-zinc-900/50 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full bg-grid-zinc-400/[0.05] [mask-image:radial-gradient(ellipse_at_center,transparent_60%,black)]" />
                        <div className="absolute top-0 left-0 w-40 h-full bg-gradient-to-r from-green-500/10 via-transparent to-transparent opacity-50 animate-[light-sweep_5s_infinite_ease-in-out]" />
                         <div className="relative z-10 flex flex-col h-full">
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
             <DialogContent className="max-w-4xl w-full h-[600px] flex p-0 gap-0 bg-zinc-900/90 backdrop-blur-2xl border-2 border-red-500/30 text-white overflow-hidden" showCloseButton={false}>
                 <style>{`
                    @keyframes pulse-glow-red {
                      0%, 100% { box-shadow: 0 0 20px 5px hsl(0 100% 50% / 0.2), 0 0 40px 10px hsl(0 100% 50% / 0.1); }
                      50% { box-shadow: 0 0 30px 10px hsl(0 100% 50% / 0.3), 0 0 50px 15px hsl(0 100% 50% / 0.2); }
                    }
                    @keyframes data-glitch {
                      0% { clip-path: inset(10% 0 80% 0); }
                      20% { clip-path: inset(90% 0 5% 0); }
                      40% { clip-path: inset(40% 0 45% 0); }
                      60% { clip-path: inset(70% 0 10% 0); }
                      80% { clip-path: inset(25% 0 60% 0); }
                      100% { clip-path: inset(10% 0 80% 0); }
                    }
                 `}</style>
                 <div className="w-1/2 h-full flex flex-col items-center justify-center p-8 bg-black/30 relative overflow-hidden">
                     <div className="absolute inset-0 bg-grid-red-500/10 [mask-image:radial-gradient(ellipse_at_center,white_30%,transparent_100%)]" />
                     <motion.div 
                        initial={{ scale: 0.5, opacity: 0 }} 
                        animate={{ scale: 1, opacity: 1 }} 
                        transition={{ delay: 0.2, type: "spring", stiffness: 150, damping: 20 }} 
                        className="relative z-10 flex flex-col items-center text-center"
                    >
                        <div className="relative w-40 h-40 flex items-center justify-center">
                            <div className="absolute inset-0 animate-[pulse-glow-red_3s_infinite_ease-in-out]" />
                            <div className="absolute inset-0 animate-[data-glitch_1s_steps(2,end)_infinite]">
                                <div className="absolute inset-0 rounded-full border-2 border-red-500/50" />
                                <div className="absolute inset-2 rounded-full border-2 border-red-500/60" />
                            </div>
                            <AlertCircle className="size-20 text-red-400" />
                        </div>
                        <h2 className="text-3xl font-bold text-white mt-4">Acción Requerida</h2>
                        <p className="text-red-200/70 text-lg mt-1">Anomalías detectadas en el sistema.</p>
                    </motion.div>
                </div>
                
                 <div className="w-1/2 h-full flex flex-col p-8 bg-zinc-900/50 relative overflow-hidden">
                     <div className="absolute top-0 left-0 w-full h-full bg-grid-zinc-400/[0.05] [mask-image:radial-gradient(ellipse_at_center,transparent_60%,black)]" />
                     <div className="absolute top-0 left-0 w-40 h-full bg-gradient-to-r from-red-500/10 via-transparent to-transparent opacity-50" />
                     <div className="relative z-10 flex flex-col h-full">
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
                                    className="p-3 rounded-lg border bg-black/20"
                                >
                                    <div className="flex items-center justify-between gap-3">
                                      <div className="flex items-center gap-3">
                                        {domain.status === 'ok' ? <CheckCircle className="size-5 text-green-400" /> : <AlertCircle className="size-5 text-red-400" />}
                                        <span className="font-mono text-white/90">{domain.name}</span>
                                      </div>
                                    </div>
                                    {domain.status === 'error' && (
                                       <div className="pl-8 pt-3">
                                         <Button size="sm" className="h-8 bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:opacity-90 w-full" onClick={() => handleAnalyzeDomain(domain.name)}>
                                            <Bot className="mr-2" /> Analizar con IA
                                        </Button>
                                       </div>
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

    
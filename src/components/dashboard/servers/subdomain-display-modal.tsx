
"use client";

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Fingerprint, BrainCircuit, X } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface SubdomainDisplayModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  fullSubdomain: string;
}

export function SubdomainDisplayModal({ isOpen, onOpenChange, fullSubdomain }: SubdomainDisplayModalProps) {
    
    const truncateSubdomain = (name: string): React.ReactNode => {
        const prefix = name.split('.')[0];
        const domain = name.substring(prefix.length);

        if (name.length > 60) {
            const truncatedPrefix = `${prefix.substring(0, 60 - domain.length - 3)}...`;
            return <><strong style={{color: '#AD00EC'}}>{truncatedPrefix}</strong><span>{domain}</span></>;
        }
        return <><strong style={{color: '#AD00EC'}}>{prefix}</strong><span>{domain}</span></>;
    };
    
    const truncatedSubdomain = truncateSubdomain(fullSubdomain);
    const isTooLong = fullSubdomain.length > 60;
    const recommendationColor = "#00ADEC";

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent showCloseButton={false} className="max-w-4xl w-full h-[650px] flex p-0 gap-0 bg-black/80 backdrop-blur-xl border text-white overflow-hidden" style={{borderColor: `${recommendationColor}4D`}}>
                 <style>{`
                    .info-grid {
                        background-image:
                            linear-gradient(to right, hsl(190 100% 50% / 0.1) 1px, transparent 1px),
                            linear-gradient(to bottom, hsl(190 100% 50% / 0.1) 1px, transparent 1px);
                        background-size: 2rem 2rem;
                    }
                    .scan-line-info {
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        height: 3px;
                        background: radial-gradient(ellipse 50% 100% at 50% 0%, ${recommendationColor}80, transparent 80%);
                        animation: scan-info 5s infinite linear;
                    }
                    @keyframes scan-info {
                        0% { transform: translateY(-10px); }
                        100% { transform: translateY(100vh); }
                    }
                    .character-cell {
                        background: radial-gradient(circle at center, rgba(0, 173, 236, 0.2) 0%, transparent 70%);
                        border: 1px solid rgba(0, 173, 236, 0.3);
                        box-shadow: 0 0 15px rgba(0, 173, 236, 0.2);
                        transition: all 0.3s ease;
                    }
                    .character-cell:hover {
                         box-shadow: 0 0 25px rgba(0, 173, 236, 0.4);
                         transform: scale(1.05);
                    }
                `}</style>
                
                 <div className="sr-only">
                    <DialogHeader>
                        <DialogTitle>Detalles del Subdominio</DialogTitle>
                        <DialogDescription>Información y recomendaciones para el subdominio.</DialogDescription>
                    </DialogHeader>
                </div>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 overflow-hidden">
                    {/* Left Column: Recommendation */}
                    <div className="p-8 flex flex-col items-center justify-between text-center border-r border-cyan-400/20 bg-black/30 relative overflow-hidden animated-grid">
                       <div className="scan-line-info" />
                       <div className="z-10 flex-grow flex flex-col items-center justify-center">
                            <BrainCircuit className="mx-auto size-16 mb-4" style={{color: recommendationColor, filter: `drop-shadow(0 0 10px ${recommendationColor})`}}/>
                            <h3 className="text-2xl font-bold" style={{color: recommendationColor}}>Recomendación de la IA</h3>
                            <p className="text-sm text-white/70 mt-4 max-w-md mx-auto">
                                Para maximizar la entregabilidad y evitar que tus correos sean marcados como spam, es crucial que los nombres de subdominios no sean excesivamente largos. Un subdominio largo puede ser una señal de alerta para los filtros de correo.
                            </p>
                             <p className="text-sm text-white/70 mt-4 max-w-md mx-auto">
                                <strong className="text-white">Recomendamos mantener los nombres de subdominios por debajo de los 60 caracteres.</strong>
                            </p>
                        </div>
                         <Button
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="w-full mt-8 bg-transparent text-cyan-300 hover:text-white z-10 border-[#00ADEC] hover:bg-[#00ADEC]"
                        >
                            <X className="mr-2"/>
                            Entendido
                        </Button>
                    </div>
                    {/* Right Column: Details */}
                    <div className="p-8 flex flex-col items-center justify-center bg-black/20 space-y-8">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="relative p-6 rounded-lg bg-black/40 border border-white/10 w-full text-center"
                        >
                             <div className="absolute inset-2 border border-dashed border-white/10 rounded-md animate-pulse" />
                             <div className="absolute w-full h-full top-0 left-0 overflow-hidden">
                                <div className="scan-line-info" />
                            </div>
                            <div className="relative">
                                <Label className="text-xs text-cyan-300 uppercase tracking-widest flex items-center justify-center gap-2">
                                    <Fingerprint className="size-4"/>
                                    Identificador de Subdominio
                                </Label>
                                <p className="text-3xl font-mono break-all mt-2" title={fullSubdomain}>
                                    {truncatedSubdomain}
                                </p>
                            </div>
                        </motion.div>
                        
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="p-4 rounded-lg bg-black/40 border border-white/10 w-full text-center"
                        >
                            <h4 className="text-sm font-semibold text-cyan-300">Conteo de Caracteres</h4>
                            <div
                                className="mt-2 px-4 py-2 rounded-md font-mono text-4xl font-bold character-cell"
                                style={{ color: isTooLong ? '#F00000' : 'white' }}
                            >
                                {fullSubdomain.length}
                            </div>
                             {isTooLong && (
                                <div className="mt-3 p-2 text-xs rounded-md flex items-center justify-center gap-2 bg-red-500/10 text-red-400 border border-red-500/20">
                                    <AlertTriangle className="size-4 shrink-0" />
                                    <span>El nombre del subdominio es demasiado largo. El receptor podría rechazar tu dirección de correo electrónico.</span>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

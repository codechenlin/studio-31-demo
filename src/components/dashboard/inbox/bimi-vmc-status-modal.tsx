
"use client";

import React from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Check, X, ShieldCheck } from 'lucide-react';
import { type Email } from './email-list-item';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface BimiVmcStatusModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  email: Email | null;
  senderEmail: string;
}

const StatusIndicator = ({ status, title, description, resultText, resultDescription }: { status: boolean, title: string, description: string, resultText: string, resultDescription: string }) => (
    <motion.div 
        className="p-4 rounded-lg bg-black/30 border border-cyan-400/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
    >
        <div className="flex items-start gap-4">
            <div className="flex-1">
                <h4 className="font-bold text-lg text-white">{title}</h4>
                <p className="text-sm text-cyan-200/70 mt-1">{description}</p>
            </div>
        </div>
         <div className={cn(
            "mt-4 text-sm font-semibold p-3 rounded-md flex items-center gap-3 border",
            status ? "bg-green-900/40 border-green-500/50 text-green-300" : "bg-red-900/40 border-red-500/50 text-red-300"
        )}>
            {status ? <ShieldCheck className="size-8 shrink-0" /> : <X className="size-8 shrink-0" />}
            <div>
               <p className="font-bold uppercase">{resultText}</p>
               <p className="font-normal text-xs">{resultDescription}</p>
            </div>
        </div>
    </motion.div>
);


export function BimiVmcStatusModal({ isOpen, onOpenChange, email, senderEmail }: BimiVmcStatusModalProps) {
    if (!email) return null;

    const senderInitial = email.from.charAt(0).toUpperCase();

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl w-full flex p-0 gap-0 bg-zinc-900/90 backdrop-blur-xl border border-cyan-400/20 text-white overflow-hidden" showCloseButton={false}>
                 <div className="absolute inset-0 z-0 opacity-10">
                    <div className="absolute h-full w-full bg-[radial-gradient(#00ADEC_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
                </div>
                <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-500/10 rounded-full animate-pulse-slow filter blur-3xl -translate-x-1/2 -translate-y-1/2"/>
                
                {/* Left Panel */}
                <div className="w-1/3 flex flex-col items-center justify-center p-8 border-r border-cyan-400/20 bg-black/20 relative overflow-hidden">
                   <div className="absolute inset-0 hexagonal-grid opacity-20" />
                   <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black" />
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.1, type: "spring", stiffness: 150 }}
                        className="text-center z-10 w-full"
                    >
                        <div className="relative w-48 h-48 mx-auto group">
                          <svg className="absolute inset-0 w-full h-full animate-[hud-spin_20s_linear_infinite]" viewBox="0 0 100 100">
                             <defs><linearGradient id="hexagon-glow" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#00ADEC" /><stop offset="100%" stopColor="#AD00EC" /></linearGradient></defs>
                             <path d="M 50,5 L 95,27.5 L 95,72.5 L 50,95 L 5,72.5 L 5,27.5 Z" stroke="url(#hexagon-glow)" strokeWidth="0.5" fill="none" className="opacity-50" />
                             <path d="M 50,5 L 95,27.5 L 95,72.5 L 50,95 L 5,72.5 L 5,27.5 Z" stroke="#00ADEC" strokeWidth="0.2" fill="none" strokeDasharray="5,10" className="animate-[hud-spin_10s_linear_infinite] opacity-30" style={{animationDirection: 'reverse'}}/>
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Avatar className="size-40 border-4 border-cyan-400/30 shadow-[0_0_30px_#00ADEC]">
                                <AvatarImage src={email.avatarUrl} alt={email.from}/>
                                <AvatarFallback className="text-6xl font-bold bg-gradient-to-br from-blue-400 to-cyan-400 text-white">
                                {senderInitial}
                                </AvatarFallback>
                            </Avatar>
                          </div>
                        </div>
                        <DialogTitle className="text-2xl font-bold mt-6 text-white truncate w-full">{email.from}</DialogTitle>
                        <DialogDescription className="font-mono text-sm text-cyan-300/80 mt-1 truncate w-full">{senderEmail}</DialogDescription>
                    </motion.div>
                </div>
                
                {/* Right Panel */}
                <div className="w-2/3 flex flex-col p-8">
                     <DialogHeader className="z-10 text-left mb-6">
                         <h2 className="text-2xl font-bold text-cyan-300">Análisis de Autenticidad de Marca</h2>
                    </DialogHeader>
                    <div className="flex-1 space-y-6">
                        <StatusIndicator 
                            status={!!email.bimi}
                            title="Verificación BIMI"
                            description={email.bimi 
                                ? "El correo del remitente tiene un registro DNS BIMI, lo que hace que el destinatario muestre su logo marca oficial junto a su dirección de correo."
                                : "El correo del remitente no tiene un registro DNS BIMI, lo que hace que el destinatario no pueda mostrar un logo marca oficial junto a su dirección de correo."
                            }
                            resultText={email.bimi ? "VERIFICADO" : "INVALIDO"}
                            resultDescription={email.bimi 
                                ? "El remitente esta mostrando su logo marca oficial."
                                : "El remitente no ha configurado un registro BIMI, no muestra ningún logotipo o marca oficial."
                            }
                        />
                        <StatusIndicator 
                            status={!!email.vmc}
                            title="Certificado VMC"
                             description={email.vmc 
                                ? "El correo del remitente tiene un registro DNS BIMI y un certificado VMC emitido por una autoridad oficial, el cual certifica que el logotipo mostrado está registrado y es propiedad legítima del remitente."
                                : "El correo del remitente no tiene un registro DNS BIMI y un certificado VMC emitido, el cual su logotipo marca no está registrado y tampoco es una propiedad legítima del remitente."
                            }
                            resultText={email.vmc ? "VERIFICADO" : "INVALIDO"}
                            resultDescription={email.vmc 
                                ? "El remitente cuenta con un logo marca registrada por una autoridad oficial."
                                : "El remitente no tiene un certificado VMC, por lo que su logotipo marca no esta registrado y podría no mostrarse en todas las bandejas de entrada de correos."
                            }
                        />
                    </div>
                     <DialogFooter className="z-10 pt-6">
                        <Button 
                            onClick={() => onOpenChange(false)}
                            className="w-full bg-cyan-800/80 text-cyan-100 hover:bg-cyan-700 border border-cyan-600/50"
                        >
                            Entendido
                        </Button>
                    </DialogFooter>
                </div>

            </DialogContent>
        </Dialog>
    );
}


"use client";

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Globe, GitBranch, Check, FolderOpen, ArrowRight } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const mockVerifiedDomains = ['mailflow.ai', 'marketingpro.com', 'analytics.data.info'];

interface SubdomainModalProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    hasVerifiedDomains: boolean;
}

export function SubdomainModal({ isOpen, onOpenChange, hasVerifiedDomains }: SubdomainModalProps) {
    if (!hasVerifiedDomains) {
        return (
             <Dialog open={isOpen} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-lg bg-zinc-900/90 border-amber-500/50 backdrop-blur-lg text-white overflow-hidden p-0">
                   <div className="relative p-8 text-center bg-gradient-to-b from-amber-500/10 via-black/20 to-black/20">
                     <div className="absolute inset-0 bg-grid-zinc-400/[0.05] bg-grid-16 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"/>
                     <div className="flex justify-center pb-4">
                        <div className="relative size-20">
                            <div className="absolute inset-0 rounded-full bg-amber-500/20 animate-[spin-slow_5s_linear_infinite]" />
                            <AlertTriangle className="absolute inset-0 m-auto size-14 text-amber-400 animate-pulse" style={{filter: 'drop-shadow(0 0 10px hsl(var(--primary)))'}} />
                        </div>
                     </div>
                     <DialogHeader>
                        <DialogTitle className="text-center text-xl text-amber-300">Acción Requerida</DialogTitle>
                     </DialogHeader>
                   </div>
                    <div className="px-8 pb-8">
                      <DialogDescription className="text-center text-muted-foreground">
                          No puedes añadir un subdominio porque aún no has verificado un dominio principal.
                          <br /><br />
                          <strong>Ejemplo:</strong> Primero debes verificar <strong>`ejemplo.com`</strong> antes de poder añadir `marketing.ejemplo.com`.
                      </DialogDescription>
                      <DialogFooter className="mt-6">
                          <Button className="w-full bg-amber-600 hover:bg-amber-500 text-white" onClick={() => onOpenChange(false)}>Entendido</Button>
                      </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }
    
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl bg-card/90 backdrop-blur-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-3 text-xl"><GitBranch className="text-primary"/>Añadir Subdominio</DialogTitle>
                    <DialogDescription>
                        Selecciona el dominio principal al que pertenecerá tu nuevo subdominio para continuar con el proceso de verificación.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <h3 className="font-semibold text-foreground mb-3">Tus Dominios Verificados</h3>
                    <ScrollArea className="h-60 border rounded-lg p-2 bg-background/50">
                        {mockVerifiedDomains.length > 0 ? (
                            <div className="space-y-2">
                                {mockVerifiedDomains.map(domain => (
                                    <button key={domain} className="w-full text-left p-3 rounded-md flex items-center justify-between transition-colors hover:bg-muted">
                                        <span className="font-mono text-sm">{domain}</span>
                                        <div className="flex items-center gap-2 text-green-500">
                                            <Check className="size-4"/>
                                            <span className="text-xs">Verificado</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        ) : (
                             <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-center">
                                <FolderOpen className="size-10 mb-2"/>
                                <p className="font-semibold">No hay dominios verificados</p>
                                <p className="text-sm">Añade y verifica un dominio principal primero.</p>
                             </div>
                        )}
                    </ScrollArea>
                </div>
                 <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
                    <Button>
                        Seleccionar y Continuar <ArrowRight className="ml-2"/>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

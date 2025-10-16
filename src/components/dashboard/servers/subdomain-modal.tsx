
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
                <DialogContent className="sm:max-w-lg bg-card/90 backdrop-blur-lg">
                    <DialogHeader>
                        <div className="flex justify-center pb-4">
                            <AlertTriangle className="size-14 text-amber-400" />
                        </div>
                        <DialogTitle className="text-center text-xl">Acción Requerida</DialogTitle>
                        <DialogDescription className="text-center">
                            No puedes añadir un subdominio porque aún no has verificado un dominio principal.
                            <br /><br />
                            <strong>Ejemplo:</strong> Primero debes verificar <strong>`ejemplo.com`</strong> antes de poder añadir `marketing.ejemplo.com`.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button className="w-full" onClick={() => onOpenChange(false)}>Entendido</Button>
                    </DialogFooter>
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

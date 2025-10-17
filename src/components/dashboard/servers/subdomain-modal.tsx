
"use client";

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

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
    
    // The rest of the component for when domains are verified...
    // This part remains unchanged as per the request.
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
             <DialogContent>
                <DialogHeader>
                  <DialogTitle>Funcionalidad en desarrollo</DialogTitle>
                  <DialogDescription>
                    Esta parte de la aplicación todavía se está construyendo.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button onClick={() => onOpenChange(false)}>Cerrar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

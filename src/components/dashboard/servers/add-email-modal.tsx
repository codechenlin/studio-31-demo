
"use client";

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Globe, GitBranch, Check } from 'lucide-react';

const mockVerifiedDomains = ['mailflow.ai', 'marketingpro.com', 'analytics.data.info'];
const mockVerifiedSubdomains = ['blog.mailflow.ai', 'shop.marketingpro.com'];

interface AddEmailModalProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    hasVerifiedDomains: boolean;
}

export function AddEmailModal({ isOpen, onOpenChange, hasVerifiedDomains }: AddEmailModalProps) {
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
                          Es necesario verificar un dominio principal antes de poder crear direcciones de correo electrónico.
                           <br /><br />
                          <strong>Ejemplo:</strong> Verifica <strong>`ejemplo.com`</strong> para luego poder crear `ventas@ejemplo.com`.
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
    // This part remains unchanged.
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
             <DialogContent className="max-w-2xl bg-card/90 backdrop-blur-lg">
                <DialogHeader>
                    <DialogTitle>Crear Nueva Dirección de Correo</DialogTitle>
                    <DialogDescription>
                       Selecciona el dominio o subdominio donde deseas crear la nueva dirección.
                    </DialogDescription>
                </DialogHeader>
                 <div className="py-4">
                   <Tabs defaultValue="domains">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="domains">Dominios Principales</TabsTrigger>
                            <TabsTrigger value="subdomains">Subdominios</TabsTrigger>
                        </TabsList>
                        <div className="h-60 mt-2">
                            <TabsContent value="domains">
                               <ScrollArea className="h-full border rounded-lg p-2 bg-background/50">
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
                               </ScrollArea>
                            </TabsContent>
                            <TabsContent value="subdomains">
                               <ScrollArea className="h-full border rounded-lg p-2 bg-background/50">
                                  <div className="space-y-2">
                                    {mockVerifiedSubdomains.map(subdomain => (
                                        <button key={subdomain} className="w-full text-left p-3 rounded-md flex items-center justify-between transition-colors hover:bg-muted">
                                            <span className="font-mono text-sm">{subdomain}</span>
                                             <div className="flex items-center gap-2 text-green-500">
                                                <Check className="size-4"/>
                                                <span className="text-xs">Verificado</span>
                                            </div>
                                        </button>
                                    ))}
                                  </div>
                               </ScrollArea>
                            </TabsContent>
                        </div>
                   </Tabs>
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

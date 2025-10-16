
"use client";

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, MailPlus, Check, ArrowRight } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
                <DialogContent className="sm:max-w-lg bg-card/90 backdrop-blur-lg">
                    <DialogHeader>
                        <div className="flex justify-center pb-4">
                            <AlertTriangle className="size-14 text-amber-400" />
                        </div>
                        <DialogTitle className="text-center text-xl">Acción Requerida</DialogTitle>
                        <DialogDescription className="text-center">
                            Es necesario verificar un dominio principal antes de poder crear direcciones de correo electrónico.
                             <br /><br />
                            <strong>Ejemplo:</strong> Verifica <strong>`ejemplo.com`</strong> para luego poder crear `ventas@ejemplo.com`.
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
                    <DialogTitle className="flex items-center gap-3 text-xl"><MailPlus className="text-primary"/>Crear Nueva Dirección de Correo</DialogTitle>
                    <DialogDescription>
                       Selecciona el dominio o subdominio donde deseas crear la nueva dirección de correo electrónico.
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

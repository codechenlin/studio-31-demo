
"use client";

import React, { useState, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Flame, Loader2, AlertTriangle, CheckCircle as CheckCircleIcon, Microscope, FileWarning, ShieldCheck, ShieldAlert, UploadCloud, Copy, MailWarning, KeyRound, Shield, Eye, Dna, Bot, Activity, GitBranch, Binary, Heart, Diamond, Star, Gift, Tags, Check, DollarSign, Tag, Mail, ShoppingCart, Users, Users2, ShoppingBag, ShoppingBasket, XCircle, Share2, Package, PackageCheck, UserPlus, UserCog, CreditCard, Receipt, Briefcase, Store, Megaphone, Volume2, ScrollText, GitCommit, LayoutTemplate, Globe, X, ShieldQuestion, ChevronDown, ChevronRight, Server, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { validateVmcWithApiAction, checkApiHealthAction } from './actions';
import { type VmcApiValidationOutput } from '@/ai/flows/vmc-validator-api-flow';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function DemoPage() {
    const { toast } = useToast();
    
    // VMC Verifier State
    const [vmcDomain, setVmcDomain] = useState('google.com');
    const [isVmcVerifying, startVmcVerification] = useTransition();
    const [vmcResult, setVmcResult] = useState<VmcApiValidationOutput | null>(null);
    const [vmcError, setVmcError] = useState<string | null>(null);

    // API Health Check State
    const [isCheckingHealth, startHealthCheck] = useTransition();
    const [healthStatus, setHealthStatus] = useState<'idle' | 'checking' | 'ok' | 'error'>('idle');
    const [healthError, setHealthError] = useState<string | null>(null);

    const handleVmcVerification = () => {
        if (!vmcDomain) {
            toast({ title: 'Campo vacío', description: 'Por favor, introduce un dominio para verificar.', variant: 'destructive' });
            return;
        }
        setVmcResult(null);
        setVmcError(null);
        startVmcVerification(async () => {
            const result = await validateVmcWithApiAction({ domain: vmcDomain });
            if (result.success && result.data) {
                setVmcResult(result.data);
            } else {
                setVmcError(result.error || 'Ocurrió un error desconocido.');
            }
        });
    };
    
    const handleHealthCheck = () => {
        setHealthStatus('checking');
        setHealthError(null);
        startHealthCheck(async () => {
            const result = await checkApiHealthAction();
            if (result.success && result.data?.status === 'ok') {
                setHealthStatus('ok');
            } else {
                setHealthStatus('error');
                setHealthError(result.error || 'El API devolvió un estado no saludable.');
            }
        });
    };
    
    const renderDnsResult = (dnsData: VmcApiValidationOutput['dns']) => {
      if (!dnsData) return <p className="text-sm text-muted-foreground">No se devolvieron datos de DNS.</p>;

      const records = [
          { name: 'BIMI', data: dnsData.bimi },
          { name: 'DMARC', data: dnsData.dmarc },
          { name: 'MX', data: dnsData.mx }
      ];

      return (
          <div className="space-y-3">
              {records.map(record => (
                  <div key={record.name} className="p-3 rounded-md bg-black/30 border border-border/50">
                      <p className="font-semibold text-primary">{record.name}</p>
                      {record.data && (
                          <div className="font-mono text-xs text-muted-foreground mt-1 space-y-1">
                              <p><span className="font-semibold text-foreground/70">Nombre:</span> {record.data.name}</p>
                              <p><span className="font-semibold text-foreground/70">Tipo:</span> {record.data.type}</p>
                               {record.name === 'MX' ? (
                                   record.data.exchanges && <p><span className="font-semibold text-foreground/70">Servidores:</span> {(record.data.exchanges as string[]).join(', ')}</p>
                               ) : (
                                   record.data.values && <p className="break-all"><span className="font-semibold text-foreground/70">Valores:</span> {(record.data.values as string[]).join(' ')}</p>
                               )}
                          </div>
                      )}
                  </div>
              ))}
          </div>
      )
    }
    
    const renderObjectDetails = (obj: object) => (
        <div className="space-y-2 text-xs">
            {Object.entries(obj).map(([key, value]) => {
                 if (typeof value === 'object' && value !== null && !Array.isArray(value)) return null; // Don't render nested objects here
                 return (
                    <div key={key} className="flex justify-between border-b border-border/20 pb-1">
                        <span className="text-muted-foreground">{key}:</span>
                        <span className="font-mono text-foreground font-semibold break-all text-right">
                            {typeof value === 'boolean' ? (value ? <CheckCircleIcon className="text-green-500 inline"/> : <XCircle className="text-red-500 inline"/>) : String(value ?? 'N/A')}
                        </span>
                    </div>
                )
            })}
        </div>
    )

    return (
        <main className="flex flex-1 flex-col gap-8 p-4 md:p-8 bg-background items-center">
            <div className="text-center max-w-3xl">
                <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-destructive flex items-center justify-center gap-2">
                    <FileWarning className="size-8"/>
                    Página de Pruebas
                </h1>
                <p className="text-muted-foreground mt-2">
                    Utiliza estos paneles para probar las integraciones con APIs externas.
                </p>
            </div>
            
            {/* VMC Verifier Panel */}
            <Card className="w-full max-w-4xl">
                 <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-xl">
                        <ShieldCheck className="text-primary"/>
                        Validador VMC con API Externa
                    </CardTitle>
                    <CardDescription>Introduce un dominio para validar su configuración BIMI/VMC usando el servicio de la API.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Input id="vmc-domain" placeholder="google.com" value={vmcDomain} onChange={e => setVmcDomain(e.target.value)} className="h-12 text-base"/>
                        <Button onClick={handleVmcVerification} disabled={isVmcVerifying} className="h-12 px-8 text-base">
                            {isVmcVerifying ? <Loader2 className="mr-2 animate-spin"/> : <Server className="mr-2"/>}
                            Validar Dominio
                        </Button>
                    </div>
                </CardContent>
                
                {(isVmcVerifying || vmcResult || vmcError) && (
                    <CardFooter className="flex flex-col items-start gap-4">
                         <Separator/>
                         {isVmcVerifying && (
                            <div className="w-full flex flex-col items-center justify-center gap-2 text-muted-foreground py-8">
                                <Loader2 className="size-8 animate-spin text-primary" />
                                <p className="font-semibold">Contactando el servidor de validación...</p>
                            </div>
                         )}
                         {vmcError && <div className="w-full text-destructive text-sm p-4 bg-destructive/10 rounded-md border border-destructive/50 flex items-center gap-3"><AlertTriangle/>{vmcError}</div>}
                         {vmcResult && (
                             <div className="w-full space-y-4">
                                <div className={cn(
                                  "p-3 rounded-lg border flex items-center justify-center gap-3 text-lg font-bold",
                                  vmcResult.status === "pass" ? "bg-green-500/10 border-green-500/30 text-green-300" : "bg-red-500/10 border-red-500/30 text-red-300"
                                )}>
                                  <ShieldCheck/>
                                  <span className="uppercase">Estado Global: {vmcResult.status}</span>
                                </div>
                                
                                <Accordion type="single" collapsible className="w-full">
                                  <AccordionItem value="dns">
                                    <AccordionTrigger>Registros DNS</AccordionTrigger>
                                    <AccordionContent>
                                        <ScrollArea className="h-48">
                                           {renderDnsResult(vmcResult.dns)}
                                        </ScrollArea>
                                    </AccordionContent>
                                  </AccordionItem>
                                   <AccordionItem value="bimi">
                                    <AccordionTrigger>Análisis BIMI</AccordionTrigger>
                                    <AccordionContent>{renderObjectDetails(vmcResult.bimi)}</AccordionContent>
                                  </AccordionItem>
                                  <AccordionItem value="svg">
                                    <AccordionTrigger>Análisis SVG</AccordionTrigger>
                                    <AccordionContent>{renderObjectDetails(vmcResult.svg)}</AccordionContent>
                                  </AccordionItem>
                                  <AccordionItem value="vmc">
                                    <AccordionTrigger>Análisis VMC</AccordionTrigger>
                                    <AccordionContent>{renderObjectDetails(vmcResult.vmc)}</AccordionContent>
                                  </AccordionItem>
                                </Accordion>
                             </div>
                         )}
                    </CardFooter>
                )}
            </Card>
            
            {/* API Health Check Panel */}
            <Card className="w-full max-w-4xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-xl">
                        <Activity className="text-primary"/>
                        Prueba de Conexión del Sistema API
                    </CardTitle>
                    <CardDescription>Verifica la conectividad con el endpoint `/health` de tu API de validación.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-lg bg-muted/50">
                    <Button onClick={handleHealthCheck} disabled={isCheckingHealth} className="w-full sm:w-auto">
                        {isCheckingHealth ? <Loader2 className="mr-2 animate-spin"/> : <Server className="mr-2"/>}
                        Verificar Estado del Sistema
                    </Button>
                    <div className="w-full sm:w-auto flex-1 p-3 rounded-lg bg-background border text-center min-h-[48px] flex items-center justify-center">
                        {healthStatus === 'checking' && (
                            <div className="flex items-center gap-2 text-primary">
                                <Loader2 className="animate-spin"/>
                                <span>Verificando...</span>
                            </div>
                        )}
                        {healthStatus === 'ok' && (
                            <div className="flex items-center gap-2 text-green-500 font-bold">
                                <CheckCircleIcon/>
                                <span>Sistema en Línea (status: ok)</span>
                            </div>
                        )}
                        {healthStatus === 'error' && (
                            <div className="flex items-center gap-2 text-destructive text-xs text-left">
                                <AlertTriangle className="size-8 shrink-0"/>
                                <div>
                                    <span className="font-bold">Error de Conexión</span>
                                    <p className="break-all">{healthError}</p>
                                </div>
                            </div>
                        )}
                        {healthStatus === 'idle' && (
                            <span className="text-zinc-500">Esperando prueba...</span>
                        )}
                    </div>
                </CardContent>
            </Card>

        </main>
    );
}


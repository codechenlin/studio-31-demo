
"use client";

import React, { useState, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Flame, Loader2, AlertTriangle, CheckCircle as CheckCircleIcon, Microscope, FileWarning, ShieldCheck, ShieldAlert, UploadCloud, Copy, MailWarning, KeyRound, Shield, Eye, Dna, Bot, Activity, GitBranch, Binary, Heart, Diamond, Star, Gift, Tags, Check, DollarSign, Tag, Mail, ShoppingCart, Users, Users2, ShoppingBag, ShoppingBasket, XCircle, Share2, Package, PackageCheck, UserPlus, UserCog, CreditCard, Receipt, Briefcase, Store, Megaphone, Volume2, ScrollText, GitCommit, LayoutTemplate, Globe, X, ShieldQuestion, ChevronDown, ChevronRight, Server, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { checkSpamAction, validateVmcWithApiAction, checkApiHealthAction } from './actions';
import { type SpamCheckerOutput } from '@/ai/flows/spam-checker-flow';
import { scanFileForVirusAction } from './actions';
import { type VirusScanOutput } from '@/ai/flows/virus-scan-types';
import { type VmcApiValidationOutput } from '@/ai/flows/vmc-validator-api-flow';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
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
                             <div className="w-full space-y-2">
                                <h4 className="font-semibold">Resultado de la API:</h4>
                                <ScrollArea className="h-80 w-full bg-black/80 text-white rounded-md p-4">
                                    <pre><code>{JSON.stringify(vmcResult, null, 2)}</code></pre>
                                </ScrollArea>
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

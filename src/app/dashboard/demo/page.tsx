
"use client";

import React, { useState, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Flame, Loader2, AlertTriangle, CheckCircle as CheckCircleIcon, Microscope, FileWarning, ShieldCheck, ShieldAlert, UploadCloud, Copy, Power, CheckCircle2, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { checkSpamAction, scanFileForVirusAction, checkApiHealthAction, validateVmcWithApiAction } from './actions';
import { type SpamCheckerOutput } from '@/ai/flows/spam-checker-flow';
import { type VirusScanOutput } from '@/ai/flows/virus-scan-types';
import { type ApiHealthOutput } from '@/ai/flows/api-health-check-flow';
import { type VmcValidatorOutput } from '@/ai/flows/vmc-validator-api-flow';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function DemoPage() {
    const { toast } = useToast();
    
    // Spam Checker State
    const [spamText, setSpamText] = useState('Win a free car by clicking here!');
    const [spamThreshold, setSpamThreshold] = useState(5.0);
    const [isSpamChecking, startSpamCheck] = useTransition();
    const [spamResult, setSpamResult] = useState<SpamCheckerOutput | null>(null);

    // Virus Scanner State
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isScanning, startScan] = useTransition();
    const [scanResult, setScanResult] = useState<VirusScanOutput | null>(null);

    // VMC Validator State
    const [vmcDomain, setVmcDomain] = useState('paypal.com');
    const [isVmcValidating, startVmcValidation] = useTransition();
    const [vmcResult, setVmcResult] = useState<VmcValidatorOutput | null>(null);
    const [vmcError, setVmcError] = useState<string | null>(null);

    // API Health Check State
    const [isCheckingHealth, startHealthCheck] = useTransition();
    const [healthResult, setHealthResult] = useState<ApiHealthOutput | null>(null);
    const [healthError, setHealthError] = useState<string | null>(null);
    
    const handleSpamCheck = () => {
        setSpamResult(null);
        startSpamCheck(async () => {
            const result = await checkSpamAction({ text: spamText, threshold: spamThreshold });
            if (result.success) {
                setSpamResult(result.data || null);
            } else {
                toast({ title: 'Error', description: result.error, variant: 'destructive' });
            }
        });
    };
    
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setScanResult(null);
        }
    };
    
    const handleVirusScan = () => {
        if (!selectedFile) {
            toast({ title: 'No hay archivo', description: 'Por favor, selecciona un archivo para escanear.', variant: 'destructive' });
            return;
        }
        setScanResult(null);
        startScan(async () => {
            const formData = new FormData();
            formData.append('file', selectedFile);
            const result = await scanFileForVirusAction(formData);
            if (result.success) {
                setScanResult(result.data || null);
            } else {
                toast({ title: 'Error de Escaneo', description: result.error, variant: 'destructive' });
            }
        });
    };

    const handleHealthCheck = () => {
        setHealthResult(null);
        setHealthError(null);
        startHealthCheck(async () => {
            const result = await checkApiHealthAction();
            if (result.success) {
                setHealthResult(result.data || null);
            } else {
                setHealthError(result.error || 'Ocurrió un error desconocido.');
            }
        });
    };
    
    const handleVmcValidation = () => {
        if (!vmcDomain) {
            toast({ title: 'Dominio Requerido', description: 'Por favor, introduce un dominio para validar.', variant: 'destructive' });
            return;
        }
        setVmcResult(null);
        setVmcError(null);
        startVmcValidation(async () => {
            const result = await validateVmcWithApiAction({ domain: vmcDomain });
            if (result.success) {
                setVmcResult(result.data || null);
            } else {
                setVmcError(result.error || 'Ocurrió un error desconocido.');
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

            {/* Mini Panel de Prueba 02 - VMC Validator */}
            <Card className="w-full max-w-4xl bg-card/50 backdrop-blur-sm border-border/40 shadow-xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-xl">
                        <Globe className="text-primary"/>
                        Mini Panel de Prueba 02: Validador VMC
                    </CardTitle>
                    <CardDescription>
                        Introduce un dominio para validar su configuración BIMI, SVG y VMC usando la API externa.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-2">
                        <Input
                            placeholder="ej. paypal.com"
                            value={vmcDomain}
                            onChange={(e) => setVmcDomain(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleVmcValidation()}
                            className="flex-1"
                        />
                        <Button onClick={handleVmcValidation} disabled={isVmcValidating} className="w-full sm:w-auto">
                            {isVmcValidating ? <Loader2 className="mr-2 animate-spin"/> : <ShieldCheck className="mr-2"/>}
                            Validar Dominio
                        </Button>
                    </div>
                </CardContent>
                <CardFooter>
                    <div className="w-full">
                        {isVmcValidating && (
                            <div className="w-full flex items-center justify-center gap-2 text-sm text-muted-foreground">
                                <Loader2 className="animate-spin" />
                                Validando y analizando {vmcDomain}... Esto puede tardar un momento.
                            </div>
                        )}
                        {vmcError && (
                            <div className="w-full text-sm p-4 rounded-md border bg-destructive/10 text-destructive border-destructive">
                                <p className="font-bold flex items-center gap-2"><AlertTriangle/>Error de Validación</p>
                                <p className="mt-1 font-mono text-xs">{vmcError}</p>
                            </div>
                        )}
                        {vmcResult && (
                             <div className="w-full text-sm">
                                <p className="font-bold mb-2">Respuesta Completa de la API:</p>
                                <ScrollArea className="max-h-80 w-full rounded-md border bg-black/20 p-4">
                                    <pre className="text-xs text-white whitespace-pre-wrap break-all">
                                        {JSON.stringify(vmcResult, null, 2)}
                                    </pre>
                                </ScrollArea>
                            </div>
                        )}
                    </div>
                </CardFooter>
            </Card>

            {/* Mini Panel de Prueba 01 - API Health Check */}
            <Card className="w-full max-w-4xl bg-card/50 backdrop-blur-sm border-border/40 shadow-xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-xl">
                        <Power className="text-primary"/>
                        Mini Panel de Prueba 01: Conexión API
                    </CardTitle>
                    <CardDescription>
                        Este panel verifica la conectividad básica con la API externa de validación.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={handleHealthCheck} disabled={isCheckingHealth}>
                        {isCheckingHealth ? <Loader2 className="mr-2 animate-spin"/> : <ShieldCheck className="mr-2"/>}
                        Verificar Estado del Sistema
                    </Button>
                </CardContent>
                <CardFooter>
                    <div className="w-full">
                        {isCheckingHealth && (
                            <div className="w-full flex items-center justify-center gap-2 text-sm text-muted-foreground">
                                <Loader2 className="animate-spin" />
                                Verificando conexión con el servidor...
                            </div>
                        )}
                        {healthError && (
                            <div className="w-full text-sm p-4 rounded-md border bg-destructive/10 text-destructive border-destructive">
                                <p className="font-bold flex items-center gap-2"><AlertTriangle/>Error de Conexión</p>
                                <p className="mt-1 font-mono text-xs">{healthError}</p>
                            </div>
                        )}
                        {healthResult && (
                            <div className="w-full text-sm p-4 rounded-md border bg-green-500/10 text-green-700 dark:text-green-300 border-green-500/50">
                                <p className="font-bold flex items-center gap-2"><CheckCircle2/>Sistema en Línea</p>
                                <pre className="mt-2 text-xs bg-black/30 p-2 rounded-md">
                                    {JSON.stringify(healthResult, null, 2)}
                                </pre>
                            </div>
                        )}
                    </div>
                </CardFooter>
            </Card>
        </main>
    );
}

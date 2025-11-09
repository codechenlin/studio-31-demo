"use client";

import React, { useState, useTransition, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Power, ShieldCheck, AlertTriangle, CheckCircle, Bot, Globe, Server, Dna, MailWarning } from 'lucide-react';
import { checkApiHealthAction, validateDomainWithAI } from './actions';
import { type VmcAnalysisOutput } from './types';
import { cn } from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ScoreDisplay } from '@/components/dashboard/score-display';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';

const defaultSpamEmail = `From: test@example.com
Subject: FREE MONEY
To: user@yourdomain.com

Hello,

Click here to claim your prize! This is not a scam. 100% real.
Special offer just for you. Act now!

Best regards,
Mr. Rich
`;

interface SpamAssassinResponse {
  isSpam: boolean;
  score: number;
  sensitivity: number;
  thresholdApplied: number;
  details?: { rule: string; score: number }[];
  virusDetected?: boolean | null;
  headers?: Record<string, string>;
  processingMs?: number;
}


export default function DemoPage() {
    const [isCheckingVmcApiHealth, startVmcApiHealthCheck] = useTransition();
    const [vmcApiHealthResult, setVmcApiHealthResult] = useState<any | null>(null);
    const [vmcApiHealthError, setVmcApiHealthError] = useState<string | null>(null);
    
    const [isAnalyzing, startAnalysis] = useTransition();
    const [analysisResult, setAnalysisResult] = useState<VmcAnalysisOutput | null>(null);
    const [analysisError, setAnalysisError] = useState<string | null>(null);
    const [domainToAnalyze, setDomainToAnalyze] = useState('paypal.com');
    
    // SpamAssassin States
    const [isCheckingSpamHealth, startSpamHealthCheck] = useTransition();
    const [spamHealthResult, setSpamHealthResult] = useState<any | null>(null);
    const [spamHealthError, setSpamHealthError] = useState<string | null>(null);

    const [isScanningSpam, startSpamScan] = useTransition();
    const [spamScanResult, setSpamScanResult] = useState<SpamAssassinResponse | null>(null);
    const [spamScanError, setSpamScanError] = useState<string | null>(null);
    const [emailContent, setEmailContent] = useState(defaultSpamEmail);
    const [sensitivity, setSensitivity] = useState(5.0);
    const [clamavScan, setClamavScan] = useState(false);


    const handleVmcApiHealthCheck = () => {
        setVmcApiHealthResult(null);
        setVmcApiHealthError(null);
        startVmcApiHealthCheck(async () => {
            const result = await checkApiHealthAction();
            if (result.success) {
                setVmcApiHealthResult(result.data || null);
            } else {
                setVmcApiHealthError(result.error || 'Ocurrió un error desconocido.');
            }
        });
    };

    const handleSpamAssassinHealthCheck = () => {
        setSpamHealthResult(null);
        setSpamHealthError(null);
        startSpamHealthCheck(async () => {
            try {
                const response = await fetch('/api/spam-assassin', { method: 'GET' });
                const result = await response.json();
                if (response.ok) {
                    setSpamHealthResult(result);
                } else {
                    setSpamHealthError(result.error || `Error del servidor: ${response.status}`);
                }
            } catch (error: any) {
                setSpamHealthError(`Fallo en la conexión: ${error.message}`);
            }
        });
    };
    
    const handleAnalysis = () => {
        if (!domainToAnalyze) return;
        setAnalysisResult(null);
        setAnalysisError(null);
        startAnalysis(async () => {
            const result = await validateDomainWithAI({ domain: domainToAnalyze });
            if (result.success && result.data) {
                setAnalysisResult(result.data);
            } else {
                setAnalysisError(result.error || 'Ocurrió un error desconocido.');
            }
        });
    };

     const handleSpamScan = () => {
        setSpamScanResult(null);
        setSpamScanError(null);
        startSpamScan(async () => {
            try {
                 const response = await fetch('/api/spam-assassin', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ raw_mime: emailContent, sensitivity, clamav_scan: clamavScan }),
                });

                const result = await response.json();
                if(response.ok) {
                    setSpamScanResult(result);
                } else {
                    setSpamScanError(result.error || `Error del servidor: ${response.status}`);
                }
            } catch (error: any) {
                setSpamScanError(`Fallo en la conexión: ${error.message}`);
            }
        });
    };

    const renderAnalysisResult = (result: VmcAnalysisOutput) => {
        
        const analysisItems = [
            {
                title: "Registro BIMI",
                isValid: result.bimi_is_valid,
                description: result.bimi_description,
                verdict: result.bimi_is_valid ? "VÁLIDO" : "FALSO/INVÁLIDO"
            },
            {
                title: "Análisis SVG",
                isValid: result.svg_is_valid,
                description: result.svg_description,
                verdict: result.svg_is_valid ? "VÁLIDO" : "FALSO/INVÁLIDO"
            },
            {
                title: "Certificado VMC",
                isValid: result.vmc_is_authentic,
                description: result.vmc_description,
                verdict: result.verdict || "INDETERMINADO"
            }
        ]

        return (
             <div className="w-full text-sm space-y-4">
                {result.validation_score !== undefined && (
                   <ScoreDisplay score={result.validation_score} />
                )}
                {result.detailed_analysis && (
                    <div className="space-y-2">
                        <h3 className="font-bold text-lg text-center text-cyan-300">Análisis Detallado de la IA</h3>
                        <div className="p-3 bg-black/40 rounded-md font-mono text-xs text-white/80 whitespace-pre-wrap border border-cyan-400/20 max-h-48 overflow-y-auto custom-scrollbar">
                            {result.detailed_analysis}
                        </div>
                    </div>
                )}
                <h3 className="font-bold text-lg text-center">Veredicto de la IA</h3>
                <Accordion type="single" collapsible defaultValue="item-0" className="w-full space-y-2">
                    {analysisItems.map((item, index) => (
                        <AccordionItem key={index} value={`item-${index}`} className="bg-black/20 border-border/30 rounded-lg">
                            <AccordionTrigger className="p-4 text-base font-semibold hover:no-underline">
                               <div className="flex items-center gap-3">
                                {item.isValid 
                                    ? <CheckCircle className="size-6 text-green-400" />
                                    : <AlertTriangle className="size-6 text-red-400" />
                                }
                                <span>{item.title}:</span>
                                 <span className={cn("font-bold", item.isValid ? "text-green-400" : "text-red-400")}>{item.verdict}</span>
                               </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-4 pb-4">
                               <div className="p-3 bg-black/40 rounded-md font-mono text-xs text-white/80 whitespace-pre-wrap border border-border/20 max-h-32 overflow-y-auto custom-scrollbar">
                                 {item.description}
                               </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        )
    }

    return (
        <main className="flex flex-1 flex-col gap-8 p-4 md:p-8 bg-background items-center">
             <div className="text-center max-w-3xl">
                <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-muted-foreground">
                    Página de Pruebas de API
                </h1>
                <p className="text-muted-foreground mt-2">
                    Utiliza estos paneles para interactuar con las APIs externas y de IA.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl">
                {/* Panel 1: VMC API Health Check */}
                <Card className="bg-card/80 backdrop-blur-sm border-border/50 shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-xl">
                            <Power className="text-primary"/>
                            Mini Panel de Prueba 01: VMC API Health
                        </CardTitle>
                        <CardDescription>
                            Verifica la conectividad básica con la API de validación VMC.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={handleVmcApiHealthCheck} disabled={isCheckingVmcApiHealth}>
                            {isCheckingVmcApiHealth ? <Loader2 className="mr-2 animate-spin"/> : <ShieldCheck className="mr-2"/>}
                            Verificar Estado del Sistema
                        </Button>
                    </CardContent>
                     {(isCheckingVmcApiHealth || vmcApiHealthResult || vmcApiHealthError) && (
                        <CardFooter>
                            <div className="w-full">
                                {isCheckingVmcApiHealth && (
                                    <div className="w-full flex items-center justify-center gap-2 text-sm text-muted-foreground">
                                        <Loader2 className="animate-spin" />
                                        Verificando conexión...
                                    </div>
                                )}
                                {vmcApiHealthError && (
                                    <div className="w-full text-sm p-4 rounded-md border bg-destructive/10 text-destructive border-destructive">
                                        <p className="font-bold flex items-center gap-2"><AlertTriangle/>Error de Conexión</p>
                                        <p className="mt-1 font-mono text-xs">{vmcApiHealthError}</p>
                                    </div>
                                )}
                                {vmcApiHealthResult && (
                                    <div className="w-full text-sm p-4 rounded-md border bg-green-500/10 text-green-700 dark:text-green-300 border-green-500/50">
                                        <p className="font-bold flex items-center gap-2"><CheckCircle/>Sistema en Línea</p>
                                        <pre className="mt-2 text-xs bg-black/30 p-2 rounded-md">
                                            {JSON.stringify(vmcApiHealthResult, null, 2)}
                                        </pre>
                                    </div>
                                )}
                            </div>
                        </CardFooter>
                    )}
                </Card>
                 {/* Panel 2: AI Analysis */}
                <Card className="bg-card/80 backdrop-blur-sm border-border/50 shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-xl">
                            <Bot className="text-accent"/>
                            Mini Panel de Prueba 02: Análisis VMC con IA
                        </CardTitle>
                        <CardDescription>
                           Valida un dominio y obtén un análisis técnico de la IA sobre sus registros BIMI y VMC.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="domain-input" className="font-semibold">Dominio a Analizar</Label>
                            <div className="flex items-center gap-2 mt-2">
                                <div className="relative flex-grow">
                                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                    <Input
                                        id="domain-input"
                                        placeholder="ejemplo.com"
                                        value={domainToAnalyze}
                                        onChange={(e) => setDomainToAnalyze(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                                <Button onClick={handleAnalysis} disabled={isAnalyzing || !domainToAnalyze}>
                                    {isAnalyzing ? <Loader2 className="mr-2 animate-spin"/> : <Dna className="mr-2"/>}
                                    Validar y Analizar
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                     {(isAnalyzing || analysisResult || analysisError) && (
                        <CardFooter>
                            <div className="w-full">
                                {isAnalyzing && (
                                    <div className="w-full flex items-center justify-center gap-2 text-sm text-muted-foreground">
                                        <Loader2 className="animate-spin" />
                                        La IA está analizando los datos del dominio...
                                    </div>
                                )}
                                {analysisError && (
                                    <div className="w-full text-sm p-4 rounded-md border bg-destructive/10 text-destructive border-destructive">
                                        <p className="font-bold flex items-center gap-2"><AlertTriangle/>Error de Análisis</p>
                                        <p className="mt-1 font-mono text-xs">{analysisError}</p>
                                    </div>
                                )}
                                {analysisResult && renderAnalysisResult(analysisResult)}
                            </div>
                        </CardFooter>
                     )}
                </Card>
            </div>
            
            {/* New SpamAssassin Panel */}
             <Card className="bg-card/80 backdrop-blur-sm border-border/50 shadow-lg w-full max-w-6xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-xl">
                        <MailWarning className="text-amber-500"/>
                        Mini Panel de Prueba 03: Clasificador de Spam
                    </CardTitle>
                    <CardDescription>
                       Prueba la API de SpamAssassin para evaluar el puntaje de spam de un correo electrónico.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                       <div>
                         <Button onClick={handleSpamAssassinHealthCheck} disabled={isCheckingSpamHealth} size="sm" variant="outline">
                            {isCheckingSpamHealth ? <Loader2 className="mr-2 animate-spin"/> : <Power className="mr-2"/>}
                            Verificar Estado de API
                        </Button>
                        {(isCheckingSpamHealth || spamHealthResult || spamHealthError) && (
                          <div className="mt-2 text-xs">
                             {isCheckingSpamHealth && <p className="flex items-center gap-1 text-muted-foreground"><Loader2 className="animate-spin"/> Verificando...</p>}
                             {spamHealthError && <p className="text-destructive flex items-center gap-1"><AlertTriangle/> {spamHealthError}</p>}
                             {spamHealthResult && <pre className="p-2 bg-black/30 rounded text-green-300 border border-green-500/20">{JSON.stringify(spamHealthResult, null, 2)}</pre>}
                          </div>
                        )}
                       </div>

                        <div className="space-y-1"><Label htmlFor="email-content">Contenido del correo (MIME/RFC822)</Label><Textarea id="email-content" value={emailContent} onChange={e => setEmailContent(e.target.value)} className="h-40 font-mono text-xs" placeholder="From: ..."/></div>
                        
                        <div className="space-y-2">
                            <Label>Sensibilidad del Filtro ({sensitivity.toFixed(1)})</Label>
                            <Slider value={[sensitivity]} min={1.0} max={10.0} step={0.1} onValueChange={(value) => setSensitivity(value[0])}/>
                             <div className="flex justify-between text-xs text-muted-foreground"><span>Estricto</span><span>Relajado</span></div>
                        </div>

                         <div className="flex items-center space-x-2">
                            <Switch id="clamav-scan" checked={clamavScan} onCheckedChange={setClamavScan} />
                            <Label htmlFor="clamav-scan">Activar escaneo de antivirus (ClamAV)</Label>
                        </div>
                        
                         <Button onClick={handleSpamScan} disabled={isScanningSpam} className="w-full">
                            {isScanningSpam ? <Loader2 className="mr-2 animate-spin"/> : <ShieldCheck className="mr-2"/>}
                            Analizar Correo
                        </Button>
                    </div>
                     <div className="relative p-4 rounded-lg bg-background border border-border/50 flex flex-col">
                        <h3 className="font-semibold text-center mb-4">Resultados del Análisis</h3>
                        {isScanningSpam && (
                             <div className="flex-grow flex items-center justify-center gap-2 text-sm text-muted-foreground">
                                <Loader2 className="animate-spin" />
                                Escaneando...
                            </div>
                        )}
                         {spamScanError && (
                             <div className="flex-grow flex items-center justify-center">
                                <div className="w-full text-sm p-4 rounded-md border bg-destructive/10 text-destructive border-destructive">
                                    <p className="font-bold flex items-center gap-2"><AlertTriangle/>Error de Escaneo</p>
                                    <p className="mt-1 font-mono text-xs">{spamScanError}</p>
                                </div>
                            </div>
                        )}
                        {spamScanResult && (
                             <div className="space-y-3 flex-grow flex flex-col">
                                <div className={cn("p-4 rounded-lg text-center border-2", spamScanResult.isSpam ? "border-red-500 bg-red-500/10" : "border-green-500 bg-green-500/10")}>
                                    <p className="text-sm font-semibold uppercase">{spamScanResult.isSpam ? "Correo Considerado Spam" : "Correo Legítimo"}</p>
                                    <p className="text-3xl font-bold">{spamScanResult.score.toFixed(1)} / {spamScanResult.thresholdApplied.toFixed(1)}</p>
                                    <div className="relative h-2 w-full bg-muted/50 rounded-full mt-2">
                                        <div 
                                          className={cn("absolute h-full rounded-full", spamScanResult.isSpam ? "bg-red-500" : "bg-green-500")}
                                          style={{width: `${(spamScanResult.score / spamScanResult.thresholdApplied) * 100}%`}}
                                        />
                                        <div 
                                            className="absolute top-0 h-full w-px bg-white/50"
                                            style={{left: `${(spamScanResult.thresholdApplied / 10) * 100}%`}}
                                        />
                                    </div>
                                </div>
                                 <div className="flex-grow">
                                     <Label>Detalles del Reporte de SpamAssassin</Label>
                                     <ScrollArea className="h-48 mt-1">
                                       <pre className="text-xs p-3 rounded-md bg-black/50 font-mono whitespace-pre-wrap">
                                            {JSON.stringify(spamScanResult.details, null, 2)}
                                        </pre>
                                     </ScrollArea>
                                 </div>
                            </div>
                        )}
                        {!isScanningSpam && !spamScanResult && !spamScanError && (
                             <div className="flex-grow flex items-center justify-center text-center text-muted-foreground">
                                <p>Los resultados del escaneo aparecerán aquí.</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </main>
    );
}

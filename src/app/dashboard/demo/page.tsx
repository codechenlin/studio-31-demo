
"use client";

import React, { useState, useTransition, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Power, ShieldCheck, AlertTriangle, CheckCircle, Bot, Globe, Server, Dna } from 'lucide-react';
import { checkApiHealthAction } from './actions';
import { type ApiHealthOutput } from '@/ai/flows/api-health-check-flow';
import { validateDomainWithAI } from './actions';
import { type VmcAnalysisOutput } from './types';
import { cn } from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

const ScoreDisplay = ({ score }: { score: number }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, latest => Math.round(latest));
  const circumference = 2 * Math.PI * 45;

  useEffect(() => {
    const controls = animate(count, score, {
      duration: 1.5,
      ease: "circOut",
    });
    return controls.stop;
  }, [score, count]);

  const getScoreColor = () => {
    if (score >= 90) return 'text-green-400';
    if (score >= 70) return 'text-yellow-400';
    if (score >= 50) return 'text-orange-400';
    return 'text-red-400';
  };
  
  const getScoreBg = () => {
    if (score >= 90) return 'url(#gradient-green)';
    if (score >= 70) return 'url(#gradient-yellow)';
    if (score >= 50) return 'url(#gradient-orange)';
    return 'url(#gradient-red)';
  }
  
  const getScoreShadow = () => {
    if (score >= 90) return `drop-shadow(0 0 10px #22c55e)`;
    if (score >= 70) return `drop-shadow(0 0 10px #facc15)`;
    if (score >= 50) return `drop-shadow(0 0 10px #f97316)`;
    return `drop-shadow(0 0 10px #ef4444)`;
  }
  
  const getConfidenceLevel = () => {
    if (score >= 90) return { text: "Excelente", color: "text-green-300" };
    if (score >= 70) return { text: "Alto", color: "text-yellow-300" };
    if (score >= 50) return { text: "Medio", color: "text-orange-300" };
    return { text: "Bajo", color: "text-red-300" };
  };

  const confidence = getConfidenceLevel();

  return (
    <div className="relative w-full p-6 rounded-2xl bg-black/30 border border-cyan-400/20 flex flex-col items-center gap-4 overflow-hidden">
       <div className="absolute inset-0 z-0 opacity-20 [mask-image:radial-gradient(ellipse_at_center,white_20%,transparent_70%)]">
            {Array.from({ length: 30 }).map((_, i) => (
                <div 
                    key={i} 
                    className="absolute w-0.5 h-0.5 bg-cyan-300 rounded-full"
                    style={{
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        animation: `particle-move ${Math.random() * 5 + 3}s linear ${Math.random() * -8}s infinite`,
                    }}
                />
            ))}
            <style>{`@keyframes particle-move { 0% { transform: translate(0, 0); opacity: 1; } 100% { transform: translate(${(Math.random() - 0.5) * 200}px, ${(Math.random() - 0.5) * 200}px); opacity: 0; } }`}</style>
       </div>
       <h3 className="font-bold text-lg text-center text-cyan-300 z-10">Puntaje de Autenticidad</h3>
       <div className="relative w-40 h-40">
           <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
             <defs>
              <linearGradient id="gradient-green" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#4ade80"/><stop offset="100%" stopColor="#16a34a"/></linearGradient>
              <linearGradient id="gradient-yellow" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#fde047"/><stop offset="100%" stopColor="#facc15"/></linearGradient>
              <linearGradient id="gradient-orange" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#fb923c"/><stop offset="100%" stopColor="#f97316"/></linearGradient>
              <linearGradient id="gradient-red" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#f87171"/><stop offset="100%" stopColor="#ef4444"/></linearGradient>
            </defs>
            <circle cx="50" cy="50" r="45" stroke="rgba(255,255,255,0.1)" strokeWidth="4" fill="transparent" />
            <motion.circle
                cx="50"
                cy="50"
                r="45"
                stroke={getScoreBg()}
                strokeWidth="4"
                fill="transparent"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: circumference - (score / 100) * circumference }}
                transition={{ duration: 1.5, ease: "circOut" }}
                transform="rotate(-90 50 50)"
            />
           </svg>
           <div className="absolute inset-0 flex flex-col items-center justify-center">
             <motion.p className={cn("text-5xl font-bold", getScoreColor())} style={{ filter: getScoreShadow() }}>
                {rounded}
            </motion.p>
            <p className={cn("text-sm font-semibold tracking-wider uppercase", confidence.color)}>{confidence.text}</p>
           </div>
       </div>
    </div>
  )
}


export default function DemoPage() {
    const [isCheckingHealth, startHealthCheck] = useTransition();
    const [healthResult, setHealthResult] = useState<ApiHealthOutput | null>(null);
    const [healthError, setHealthError] = useState<string | null>(null);
    
    const [isAnalyzing, startAnalysis] = useTransition();
    const [analysisResult, setAnalysisResult] = useState<VmcAnalysisOutput | null>(null);
    const [analysisError, setAnalysisError] = useState<string | null>(null);
    const [domainToAnalyze, setDomainToAnalyze] = useState('paypal.com');
    
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
                    Utiliza estos paneles para interactuar con la API de validación externa.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl">
                {/* Panel 1: Health Check */}
                <Card className="bg-card/80 backdrop-blur-sm border-border/50 shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-xl">
                            <Power className="text-primary"/>
                            Mini Panel de Prueba 01: Prueba de Conexión
                        </CardTitle>
                        <CardDescription>
                            Verifica la conectividad básica con la API de validación.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={handleHealthCheck} disabled={isCheckingHealth}>
                            {isCheckingHealth ? <Loader2 className="mr-2 animate-spin"/> : <ShieldCheck className="mr-2"/>}
                            Verificar Estado del Sistema
                        </Button>
                    </CardContent>
                     {(isCheckingHealth || healthResult || healthError) && (
                        <CardFooter>
                            <div className="w-full">
                                {isCheckingHealth && (
                                    <div className="w-full flex items-center justify-center gap-2 text-sm text-muted-foreground">
                                        <Loader2 className="animate-spin" />
                                        Verificando conexión...
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
                                        <p className="font-bold flex items-center gap-2"><CheckCircle/>Sistema en Línea</p>
                                        <pre className="mt-2 text-xs bg-black/30 p-2 rounded-md">
                                            {JSON.stringify(healthResult, null, 2)}
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
                            Mini Panel de Prueba 02: Análisis con IA
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
        </main>
    );
}


"use client";

import React, { useState, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Flame, Loader2, AlertTriangle, CheckCircle as CheckCircleIcon, Microscope, FileWarning, ShieldCheck, ShieldAlert, UploadCloud, Copy, MailWarning, KeyRound, Shield, Eye, Dna, Bot, Activity, GitBranch, Binary, Heart, Diamond, Star, Gift, Tags, Check, DollarSign, Tag, Mail, ShoppingCart, Users, Users2, ShoppingBag, ShoppingBasket, XCircle, Share2, Package, PackageCheck, UserPlus, UserCog, CreditCard, Receipt, Briefcase, Store, Megaphone, Volume2, ScrollText, GitCommit, LayoutTemplate, Globe, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { checkSpamAction, verifyVmcAuthenticityAction } from './actions';
import { type SpamCheckerOutput } from '@/ai/flows/spam-checker-flow';
import { scanFileForVirusAction } from './actions';
import { type VirusScanOutput } from '@/ai/flows/virus-scan-types';
import { type VmcVerificationOutput } from '@/ai/flows/vmc-verification-flow';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

const spamExamples = [
    "¡¡¡GANA DINERO RÁPIDO!!! Haz clic aquí para obtener tu premio millonario. Oferta por tiempo limitado. No te lo pierdas.",
    "Felicidades, has sido seleccionado para una oferta exclusiva. Compra ahora y obtén un 90% de descuento. ¡Actúa ya!",
    "Este no es un correo no deseado. Te contactamos para ofrecerte una increíble oportunidad de inversión con retornos garantizados."
];

const eicarTestString = "X5O!P%@AP[4\\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*";

const StatusBadge = ({ status, text }: { status: boolean; text: string }) => (
    <div className={cn("flex items-center gap-2 p-2 rounded-md text-sm border", status ? "bg-green-500/10 border-green-500/20 text-green-300" : "bg-red-500/10 border-red-500/20 text-red-300")}>
        {status ? <CheckCircleIcon className="size-4" /> : <XCircle className="size-4" />}
        <span>{text}</span>
    </div>
);


export default function DemoPage() {
    const { toast } = useToast();
    
    // Spam Checker State
    const [spamText, setSpamText] = useState('');
    const [threshold, setThreshold] = useState(5.0);
    const [isSpamChecking, startSpamCheck] = useTransition();
    const [spamResult, setSpamResult] = useState<SpamCheckerOutput | null>(null);
    const [spamError, setSpamError] = useState<string | null>(null);

    // Virus Scanner State
    const [file, setFile] = useState<File | null>(null);
    const [isVirusScanning, startVirusScan] = useTransition();
    const [virusResult, setVirusResult] = useState<VirusScanOutput | null>(null);
    const [virusError, setVirusError] = useState<string | null>(null);

    // VMC Verifier State
    const [vmcDomain, setVmcDomain] = useState('');
    const [vmcSelector, setVmcSelector] = useState('default');
    const [isVmcVerifying, startVmcVerification] = useTransition();
    const [vmcResult, setVmcResult] = useState<VmcVerificationOutput | null>(null);
    const [vmcError, setVmcError] = useState<string | null>(null);

    const handleSpamCheck = () => {
        if (!spamText) {
            toast({ title: 'Campo vacío', description: 'Por favor, introduce texto para analizar.', variant: 'destructive' });
            return;
        }
        setSpamResult(null);
        setSpamError(null);
        startSpamCheck(async () => {
            const result = await checkSpamAction({ text: spamText, threshold });
            if (result.success && result.data) {
                setSpamResult(result.data);
            } else {
                setSpamError(result.error || 'Ocurrió un error desconocido.');
            }
        });
    };

     const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setFile(event.target.files[0]);
            setVirusResult(null);
            setVirusError(null);
        }
    };

    const handleVirusScan = () => {
        if (!file) {
            toast({ title: 'Ningún archivo seleccionado', description: 'Por favor, selecciona un archivo para escanear.', variant: 'destructive' });
            return;
        }
        setVirusResult(null);
        setVirusError(null);
        startVirusScan(async () => {
            const formData = new FormData();
            formData.append('file', file);
            const result = await scanFileForVirusAction(formData);
            if (result.success && result.data) {
                setVirusResult(result.data);
            } else {
                setVirusError(result.error || 'Ocurrió un error desconocido al escanear.');
            }
        });
    };
    
    const handleVmcVerification = () => {
        if (!vmcDomain) {
            toast({ title: 'Campo vacío', description: 'Por favor, introduce un dominio para verificar.', variant: 'destructive' });
            return;
        }
        setVmcResult(null);
        setVmcError(null);
        startVmcVerification(async () => {
            const result = await verifyVmcAuthenticityAction({ domain: vmcDomain, selector: vmcSelector });
            if (result.success && result.data) {
                setVmcResult(result.data);
            } else {
                setVmcError(result.error || 'Ocurrió un error desconocido.');
            }
        });
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast({
            title: "¡Texto Copiado!",
            description: "El archivo de prueba EICAR está listo para ser pegado.",
            className: 'bg-success-login border-none text-white'
        });
    };

    return (
        <>
        <main className="flex flex-1 flex-col gap-8 p-4 md:p-8 bg-background items-center">
            <div className="text-center max-w-3xl">
                <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-destructive flex items-center justify-center gap-2">
                    <FileWarning className="size-8"/>
                    Página de Pruebas
                </h1>
                <p className="text-muted-foreground mt-2">
                    Esta página es para probar integraciones con APIs externas, nuevas funcionalidades y animaciones.
                </p>
            </div>
            
            {/* VMC Verifier Panel */}
            <Card className="w-full max-w-4xl bg-card/50 backdrop-blur-sm border-purple-500/30 shadow-xl">
                 <CardHeader>
                    <CardTitle className="flex items-center gap-2"><ShieldCheck className="text-purple-400"/>Prueba de Verificador BIMI/VMC</CardTitle>
                    <CardDescription>Introduce un dominio y un selector para validar su autenticidad con IA.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2">
                            <Label htmlFor="vmc-domain">Dominio</Label>
                            <div className="relative">
                                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"/>
                                <Input id="vmc-domain" placeholder="google.com" value={vmcDomain} onChange={e => setVmcDomain(e.target.value)} className="pl-10"/>
                            </div>
                        </div>
                        <div>
                             <Label htmlFor="vmc-selector">Selector</Label>
                            <Input id="vmc-selector" placeholder="default" value={vmcSelector} onChange={e => setVmcSelector(e.target.value)} />
                        </div>
                    </div>
                     <Button onClick={handleVmcVerification} disabled={isVmcVerifying} className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:opacity-90">
                        {isVmcVerifying ? <Loader2 className="mr-2 animate-spin"/> : <Bot className="mr-2"/>}
                        Verificar Autenticidad con IA
                    </Button>
                </CardContent>
                {(isVmcVerifying || vmcResult || vmcError) && (
                    <CardFooter className="flex flex-col items-start gap-4">
                        <Separator />
                         {isVmcVerifying && (
                            <div className="w-full flex flex-col items-center justify-center gap-2 text-muted-foreground py-8">
                                <Loader2 className="animate-spin text-purple-400 size-8" />
                                <p className="font-semibold">La IA está analizando el dominio...</p>
                            </div>
                         )}
                         {vmcError && <p className="text-destructive text-sm p-4 bg-destructive/10 rounded-md w-full">{vmcError}</p>}
                         {vmcResult && (
                             <div className="w-full space-y-4">
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                     <StatusBadge status={vmcResult.bimiRecordValid} text="Registro BIMI" />
                                     <StatusBadge status={vmcResult.dmarcPolicyOk} text="Política DMARC" />
                                     <StatusBadge status={vmcResult.svgSecure} text="SVG Seguro" />
                                     <StatusBadge status={vmcResult.vmcChainValid} text="Cadena VMC Válida" />
                                     <StatusBadge status={vmcResult.vmcIdentityMatch} text="Identidad VMC" />
                                      <StatusBadge status={vmcResult.overallStatus === 'verified'} text={vmcResult.overallStatus.toUpperCase()} />
                                </div>
                                <div className="p-4 bg-black/30 rounded-lg">
                                    <h4 className="font-bold mb-2">Análisis de la IA:</h4>
                                     <ScrollArea className="max-h-40">
                                        <p className="text-sm text-white/80 whitespace-pre-line">{vmcResult.analysis}</p>
                                     </ScrollArea>
                                </div>
                             </div>
                         )}
                    </CardFooter>
                )}
            </Card>

            <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Spam Checker Panel */}
                <Card className="bg-card/50 backdrop-blur-sm border-amber-500/30 shadow-xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Flame className="text-amber-400"/>Prueba de Spam Checker (APILayer)</CardTitle>
                        <CardDescription>Introduce texto para analizar su puntuación de spam.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="spam-text">Texto a Analizar</Label>
                            <Textarea
                                id="spam-text"
                                value={spamText}
                                onChange={(e) => setSpamText(e.target.value)}
                                placeholder="Pega aquí el contenido del correo..."
                                className="min-h-[150px]"
                            />
                        </div>
                         <div className="space-y-2">
                            <Label>Ejemplos de Spam:</Label>
                            <div className="flex flex-wrap gap-2">
                                {spamExamples.map((ex, i) => (
                                    <Button key={i} size="sm" variant="outline" onClick={() => setSpamText(ex)}>
                                        Ejemplo {i + 1}
                                    </Button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="threshold">Umbral de Detección (más bajo = más estricto): {threshold.toFixed(1)}</Label>
                            <Slider
                                id="threshold"
                                min={1}
                                max={10}
                                step={0.1}
                                value={[threshold]}
                                onValueChange={(value) => setThreshold(value[0])}
                            />
                        </div>
                        <Button onClick={handleSpamCheck} disabled={isSpamChecking} className="w-full">
                            {isSpamChecking ? <Loader2 className="mr-2 animate-spin"/> : <Microscope className="mr-2"/>}
                            Analizar Spam
                        </Button>
                    </CardContent>
                    <CardFooter>
                         {spamResult && (
                            <div className="w-full space-y-3 text-sm">
                                <h4 className="font-bold">Resultado del Análisis:</h4>
                                {spamResult.is_spam ? (
                                    <div className="p-3 rounded-md bg-destructive/10 text-destructive-foreground border border-destructive/20 flex items-start gap-2">
                                        <AlertTriangle />
                                        <div>
                                            <p><strong>Resultado:</strong> <span className="font-bold">{spamResult.result}</span></p>
                                            <p><strong>Puntuación:</strong> {spamResult.score.toFixed(2)} (Umbral: {threshold.toFixed(1)})</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-3 rounded-md bg-green-500/10 text-green-700 dark:text-green-300 border border-green-500/20 flex items-start gap-2">
                                        <CheckCircleIcon />
                                        <div>
                                            <p><strong>Resultado:</strong> <span className="font-bold">{spamResult.result}</span></p>
                                            <p><strong>Puntuación:</strong> {spamResult.score.toFixed(2)} (Umbral: {threshold.toFixed(1)})</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        {spamError && <p className="text-destructive text-sm">{spamError}</p>}
                    </CardFooter>
                </Card>

                 {/* Virus Scanner Panel */}
                <Card className="bg-card/50 backdrop-blur-sm border-blue-500/30 shadow-xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-400">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>Prueba de Antivirus (ClamAV)</CardTitle>
                        <CardDescription>Sube un archivo para escanearlo en busca de virus.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Cómo Probar</Label>
                             <div className="p-3 text-xs text-blue-200 bg-blue-900/20 rounded-md border border-blue-500/30 space-y-2">
                                <p>1. Copia la siguiente cadena de texto EICAR (es un archivo de prueba inofensivo).</p>
                                <div className="flex gap-2">
                                    <Input value={eicarTestString} readOnly className="font-mono text-xs h-8 bg-black/30"/>
                                    <Button size="icon" className="h-8 w-8" variant="ghost" onClick={() => copyToClipboard(eicarTestString)}><Copy className="size-4"/></Button>
                                </div>
                                <p>2. Pega el texto en un nuevo archivo de texto y guárdalo (ej: `eicar.txt`).</p>
                                <p>3. Sube ese archivo aquí para verificar la detección.</p>
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="file-upload">Seleccionar Archivo</Label>
                            <div className="relative mt-1">
                                <Input id="file-upload" type="file" onChange={handleFileChange} className="pr-20"/>
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground truncate max-w-[100px]">
                                    {file ? file.name : "Ningún archivo"}
                                </span>
                            </div>
                        </div>
                        <Button onClick={handleVirusScan} disabled={isVirusScanning || !file} className="w-full">
                            {isVirusScanning ? <Loader2 className="mr-2 animate-spin"/> : <UploadCloud className="mr-2"/>}
                            Escanear Archivo
                        </Button>
                    </CardContent>
                    <CardFooter>
                         {virusResult && !virusError && (
                            <div className="w-full space-y-3 text-sm">
                                <h4 className="font-bold">Resultado del Escaneo:</h4>
                                {virusResult.isInfected ? (
                                    <div className="p-3 rounded-md bg-destructive/10 text-destructive-foreground border border-destructive/20 flex items-start gap-2">
                                        <ShieldAlert />
                                        <div>
                                            <p><strong>¡Amenaza Detectada!</strong></p>
                                            <p>{virusResult.message}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-3 rounded-md bg-green-500/10 text-green-700 dark:text-green-300 border border-green-500/20 flex items-start gap-2">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-5 shrink-0">
                                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                        <div>
                                            <p><strong>El archivo es seguro.</strong></p>
                                            <p>{virusResult.message}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        {virusError && (
                             <div className="p-3 rounded-md bg-destructive/10 text-destructive-foreground border border-destructive/20 flex items-start gap-2">
                                <AlertTriangle />
                                <div>
                                    <p><strong>Error al contactar el servicio de antivirus:</strong></p>
                                    <p className="text-xs">{virusError}</p>
                                </div>
                            </div>
                        )}
                    </CardFooter>
                </Card>
            </div>
            <div className="w-full max-w-4xl mt-8 p-4 bg-card/50 backdrop-blur-sm border border-border/30 rounded-lg flex items-center justify-center gap-16">
                 <div className="flex flex-col items-center gap-2">
                    <div className="text-blue-400">
                        <LayoutTemplate size={32} />
                    </div>
                    <span className="font-mono text-xs">1</span>
                </div>
            </div>
            <div className="w-full max-w-4xl mt-8 p-4 bg-card/50 backdrop-blur-sm border border-border/30 rounded-lg flex items-center justify-center gap-16">
                <div className="flex flex-col items-center gap-2">
                    <div className="text-blue-500">
                        <Share2 size={32} />
                    </div>
                    <span className="font-mono text-xs">1</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <div className="text-green-500">
                        <GitCommit size={32} />
                    </div>
                    <span className="font-mono text-xs">2</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <div className="text-purple-500">
                        <Megaphone size={32} />
                    </div>
                    <span className="font-mono text-xs">3</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <div className="text-red-500">
                        <Gift size={32} />
                    </div>
                    <span className="font-mono text-xs">4</span>
                </div>
                 <div className="flex flex-col items-center gap-2">
                    <div className="text-teal-500">
                        <Receipt size={32} />
                    </div>
                    <span className="font-mono text-xs">5</span>
                </div>
                 <div className="flex flex-col items-center gap-2">
                    <div className="text-orange-500">
                        <ScrollText size={32} />
                    </div>
                    <span className="font-mono text-xs">6</span>
                </div>
            </div>
            <div className="w-full max-w-4xl mt-8 p-4 bg-card/50 backdrop-blur-sm border border-border/30 rounded-lg flex items-center justify-center gap-16">
                <div className="flex flex-col items-center gap-2">
                    <div className="text-orange-500">
                        <ShoppingBag size={32} />
                    </div>
                    <span className="font-mono text-xs">1</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <div className="text-teal-500">
                        <ShoppingBasket size={32} />
                    </div>
                    <span className="font-mono text-xs">2</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <div className="text-sky-500">
                        <ShoppingCart size={32} />
                    </div>
                    <span className="font-mono text-xs">3</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <div className="text-lime-500">
                        <Package size={32}/>
                    </div>
                    <span className="font-mono text-xs">4</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <div className="text-indigo-500">
                        <UserPlus size={32} />
                    </div>
                    <span className="font-mono text-xs">5</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <div className="text-fuchsia-500">
                        <UserCog size={32} />
                    </div>
                    <span className="font-mono text-xs">6</span>
                </div>
            </div>
            <div className="w-full max-w-4xl mt-8 p-4 bg-card/50 backdrop-blur-sm border border-border/30 rounded-lg flex items-center justify-center gap-16">
                 <div className="flex flex-col items-center gap-2">
                    <div className="text-blue-500">
                        <PackageCheck size={32} />
                    </div>
                    <span className="font-mono text-xs">1</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <div className="text-teal-500">
                        <CreditCard size={32} />
                    </div>
                    <span className="font-mono text-xs">2</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <div className="text-orange-500">
                        <Receipt size={32} />
                    </div>
                    <span className="font-mono text-xs">3</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <div className="text-indigo-500">
                        <ShoppingBag size={32} />
                    </div>
                    <span className="font-mono text-xs">4</span>
                </div>
                 <div className="flex flex-col items-center gap-2">
                    <div className="text-fuchsia-500">
                        <Briefcase size={32} />
                    </div>
                    <span className="font-mono text-xs">5</span>
                </div>
                 <div className="flex flex-col items-center gap-2">
                    <div className="text-rose-500">
                        <Store size={32} />
                    </div>
                    <span className="font-mono text-xs">6</span>
                </div>
            </div>
        </main>
        </>
    );
}


"use client";

import React, { useState, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertTriangle, Check, CheckCircle, Flame, Globe, Loader2, Power, ShieldCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { checkApiHealthAction, validateVmcWithApiAction } from './actions';
import { type ApiHealthOutput } from '@/ai/flows/api-health-check-flow';
import { type VmcValidatorOutput } from '@/ai/flows/vmc-validator-api-flow';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { cn } from '@/lib/utils';

export default function DemoPage() {
    const { toast } = useToast();

    // VMC Validator State
    const [vmcDomain, setVmcDomain] = useState('paypal.com');
    const [isVmcValidating, startVmcValidation] = useTransition();
    const [vmcResult, setVmcResult] = useState<VmcValidatorOutput | null>(null);
    const [vmcError, setVmcError] = useState<string | null>(null);

    // API Health Check State
    const [isCheckingHealth, startHealthCheck] = useTransition();
    const [healthResult, setHealthResult] = useState<ApiHealthOutput | null>(null);
    const [healthError, setHealthError] = useState<string | null>(null);
    
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
    
    const DnsRecordDisplay = ({ record, title }: { record: VmcValidatorOutput['dns']['bimi'] | VmcValidatorOutput['dns']['dmarc'] | VmcValidatorOutput['dns']['mx']; title: string }) => (
      <div className="p-3 rounded-lg bg-black/30 border border-border/20">
        <p className="font-semibold text-sm mb-2">{title}</p>
        <div className="text-xs space-y-1 font-mono text-muted-foreground">
          <p><span className="font-bold text-foreground/80">Nombre:</span> {record.name}</p>
          <p><span className="font-bold text-foreground/80">Tipo:</span> {record.type}</p>
          <div className="space-y-1">
            <p className="font-bold text-foreground/80">Valores:</p>
            {(Array.isArray(record.values) && record.values.length > 0) ? (
              record.values.map((value, index) => (
                <div key={index} className="pl-2 border-l-2 border-primary/50 text-wrap break-words">
                  {typeof value === 'object' ? JSON.stringify(value) : value}
                </div>
              ))
            ) : <p className="pl-2">Vacío</p>}
          </div>
        </div>
      </div>
    );
    
    const StatusItem = ({ label, value }: { label: string; value: boolean | string | null | undefined }) => (
        <div className="flex justify-between items-center text-sm py-1.5 border-b border-border/10">
            <span className="text-muted-foreground">{label}</span>
            <div className="flex items-center gap-2 font-semibold">
                {typeof value === 'boolean' ? (
                    value ? <Check className="size-4 text-green-400" /> : <X className="size-4 text-red-400" />
                ) : null}
                <span className={cn(
                    typeof value === 'boolean' && (value ? 'text-green-300' : 'text-red-300'),
                    !value && 'text-muted-foreground'
                )}>
                    {value === null ? 'N/A' : String(value)}
                </span>
            </div>
        </div>
    );

    return (
        <main className="flex flex-1 flex-col gap-8 p-4 md:p-8 bg-background items-center">
             <div className="text-center max-w-3xl">
                <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-muted-foreground flex items-center justify-center gap-2">
                    <Flame className="size-8"/>
                    Página de Pruebas
                </h1>
                <p className="text-muted-foreground mt-2">
                    Utiliza estos paneles para probar las integraciones con APIs externas.
                </p>
            </div>

            {/* Mini Panel de Prueba 01 - VMC Validator */}
            <Card className="w-full max-w-4xl bg-card/80 backdrop-blur-sm border-border/50 shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-xl">
                        <Globe className="text-primary"/>
                        Validador VMC con API Externa
                    </CardTitle>
                    <CardDescription>
                        Introduce un dominio para validar su configuración BIMI, SVG y VMC.
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
                {vmcResult && (
                    <CardFooter className="flex-col items-start gap-4">
                        <div className="w-full">
                            <h3 className="text-lg font-semibold mb-2">Resultados de Validación</h3>
                            <Accordion type="single" collapsible className="w-full" defaultValue="status">
                                <AccordionItem value="status">
                                    <AccordionTrigger>Estado Global</AccordionTrigger>
                                    <AccordionContent>
                                        <div className={cn(
                                            "p-4 rounded-lg border text-center",
                                            vmcResult.status === 'pass' && 'bg-green-500/10 border-green-500/30 text-green-300',
                                            vmcResult.status === 'fail' && 'bg-red-500/10 border-red-500/30 text-red-300',
                                            (vmcResult.status === 'pass_without_vmc' || vmcResult.status === 'indeterminate_revocation') && 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300'
                                        )}>
                                            <p className="font-bold text-xl uppercase">{vmcResult.status.replace(/_/g, ' ')}</p>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="dns">
                                    <AccordionTrigger>Registros DNS</AccordionTrigger>
                                    <AccordionContent className="space-y-2">
                                        <DnsRecordDisplay record={vmcResult.dns.bimi} title="Registro BIMI"/>
                                        <DnsRecordDisplay record={vmcResult.dns.dmarc} title="Registro DMARC"/>
                                        <DnsRecordDisplay record={vmcResult.dns.mx} title="Registros MX"/>
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="bimi">
                                    <AccordionTrigger>Detalles BIMI</AccordionTrigger>
                                    <AccordionContent>
                                        <StatusItem label="Existe" value={vmcResult.bimi.exists} />
                                        <StatusItem label="Sintaxis OK" value={vmcResult.bimi.syntax_ok} />
                                        <StatusItem label="DMARC Forzado" value={vmcResult.bimi.dmarc_enforced} />
                                    </AccordionContent>
                                </AccordionItem>
                                 <AccordionItem value="svg">
                                    <AccordionTrigger>Detalles SVG (Logo)</AccordionTrigger>
                                    <AccordionContent>
                                        <StatusItem label="Existe" value={vmcResult.svg.exists} />
                                        <StatusItem label="Cumple Normas" value={vmcResult.svg.compliant} />
                                        <StatusItem label="Mensaje" value={vmcResult.svg.message} />
                                    </AccordionContent>
                                </AccordionItem>
                                 <AccordionItem value="vmc">
                                    <AccordionTrigger>Detalles VMC (Certificado)</AccordionTrigger>
                                    <AccordionContent>
                                        <StatusItem label="Existe" value={vmcResult.vmc.exists} />
                                        <StatusItem label="Auténtico" value={vmcResult.vmc.authentic} />
                                        <StatusItem label="Cadena OK" value={vmcResult.vmc.chain_ok} />
                                        <StatusItem label="Vigente" value={vmcResult.vmc.valid_now} />
                                        <StatusItem label="Revocación OK" value={vmcResult.vmc.revocation_ok} />
                                        <StatusItem label="Mensaje" value={vmcResult.vmc.message} />
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="raw">
                                    <AccordionTrigger>Respuesta Completa (JSON)</AccordionTrigger>
                                    <AccordionContent>
                                        <ScrollArea className="max-h-60 w-full rounded-md border bg-black/20 p-4">
                                            <pre className="text-xs text-white whitespace-pre-wrap break-all">
                                                {JSON.stringify(vmcResult, null, 2)}
                                            </pre>
                                        </ScrollArea>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>
                    </CardFooter>
                )}
                {(isVmcValidating || vmcError) && (
                     <CardFooter>
                        {isVmcValidating && <div className="w-full flex items-center justify-center gap-2 text-sm text-muted-foreground"><Loader2 className="animate-spin" />Validando...</div>}
                        {vmcError && <div className="w-full text-sm p-4 rounded-md border bg-destructive/10 text-destructive"><p className="font-bold">Error de Validación</p><p>{vmcError}</p></div>}
                    </CardFooter>
                )}
            </Card>

            {/* Mini Panel de Prueba 02 - API Health Check */}
            <Card className="w-full max-w-4xl bg-card/80 backdrop-blur-sm border-border/50 shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-xl">
                        <Power className="text-primary"/>
                        Prueba de Conexión del Sistema API
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
                {(isCheckingHealth || healthResult || healthError) && (
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
        </main>
    );
}

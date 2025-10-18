
"use client";

import React, { useState, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Power, ShieldCheck, AlertTriangle, CheckCircle } from 'lucide-react';
import { checkApiHealthAction } from './actions';
import { type ApiHealthOutput } from '@/ai/flows/api-health-check-flow';

export default function DemoPage() {
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

    return (
        <main className="flex flex-1 flex-col gap-8 p-4 md:p-8 bg-background items-center">
             <div className="text-center max-w-3xl">
                <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-muted-foreground">
                    Página de Pruebas
                </h1>
                <p className="text-muted-foreground mt-2">
                    Utiliza este panel para probar la integración con la API externa.
                </p>
            </div>

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

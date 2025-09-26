
"use client";

import React, { useState, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Flame, Loader2, AlertTriangle, CheckCircle, Microscope, FileWarning } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { checkSpamAction } from './actions';
import { type SpamCheckerOutput } from '@/ai/flows/spam-checker-flow';

const spamExamples = [
    "¡¡¡GANA DINERO RÁPIDO!!! Haz clic aquí para obtener tu premio millonario. Oferta por tiempo limitado. No te lo pierdas.",
    "Felicidades, has sido seleccionado para una oferta exclusiva. Compra ahora y obtén un 90% de descuento. ¡Actúa ya!",
    "Este no es un correo no deseado. Te contactamos para ofrecerte una increíble oportunidad de inversión con retornos garantizados."
];

export default function DemoPage() {
    const { toast } = useToast();
    
    // Spam Checker State
    const [spamText, setSpamText] = useState('');
    const [threshold, setThreshold] = useState(5.0);
    const [isSpamChecking, startSpamCheck] = useTransition();
    const [spamResult, setSpamResult] = useState<SpamCheckerOutput | null>(null);
    const [spamError, setSpamError] = useState<string | null>(null);

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

    return (
        <main className="flex flex-1 flex-col gap-8 p-4 md:p-8 bg-background items-center">
            <div className="text-center max-w-3xl">
                <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-destructive flex items-center justify-center gap-2">
                    <FileWarning className="size-8"/>
                    Página de Pruebas
                </h1>
                <p className="text-muted-foreground mt-2">
                    Esta página es para probar la integración con la API de Spam Checker.
                </p>
            </div>

            <div className="w-full max-w-2xl">
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
                                        <CheckCircle />
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
            </div>
        </main>
    );
}

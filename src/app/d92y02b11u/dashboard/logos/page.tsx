
"use client";

import { useState, useTransition, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UploadCloud, Image as ImageIcon, KeyRound as KeyIcon, GalleryVertical, Loader2 } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { MediaPreview } from '@/components/admin/media-preview';
import { Separator } from '@/components/ui/separator';
import { FileManagerModal } from '@/components/dashboard/file-manager-modal';
import { updateAppConfig, uploadLogoAndGetUrl, getAppConfig } from './actions';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

function CoverSection({ 
    title, 
    description, 
    icon: Icon, 
    configKey,
    initialImageUrl,
    onConfigChange,
    isLoading
}: {
    title: string;
    description: string;
    icon: React.ElementType;
    configKey: 'loginBackgroundImageUrl' | 'signupBackgroundImageUrl' | 'forgotPasswordBackgroundImageUrl';
    initialImageUrl: string;
    onConfigChange: (key: string, value: string) => void;
    isLoading: boolean;
}) {
    const { toast } = useToast();
    const [imageUrl, setImageUrl] = useState(initialImageUrl);
    const [isFileManagerOpen, setIsFileManagerOpen] = useState(false);
    const [isUploading, startUploading] = useTransition();

    useEffect(() => {
        setImageUrl(initialImageUrl);
    }, [initialImageUrl]);

    const handleFileSelect = async (url: string) => {
        setImageUrl(url);
        setIsFileManagerOpen(false);
        await updateConfig(url);
    };
    
    const updateConfig = async (url: string) => {
        const result = await updateAppConfig(configKey, url);
        if (result.success) {
            toast({
                title: "Portada Actualizada",
                description: `El fondo de ${title.toLowerCase()} ha sido guardado.`,
            });
            onConfigChange(configKey, url);
        } else {
            toast({
                title: "Error al Guardar",
                description: result.error,
                variant: "destructive",
            });
             // Revert optimistic UI update on failure
            setImageUrl(initialImageUrl);
        }
    };
    
     const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        startUploading(async () => {
            const formData = new FormData();
            formData.append('file', file);
            
            const result = await uploadLogoAndGetUrl(formData);

            if (result.success && result.url) {
                setImageUrl(result.url); // Optimistic UI update
                await updateConfig(result.url);
            } else {
                toast({
                    title: "Error al Subir",
                    description: result.error || "No se pudo subir el archivo.",
                    variant: "destructive",
                });
            }
        });
    };

    return (
      <>
        <FileManagerModal
          open={isFileManagerOpen}
          onOpenChange={setIsFileManagerOpen}
          onFileSelect={handleFileSelect}
        />
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Icon /> {title}</CardTitle>
                <CardDescription>
                    {description}
                </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h3 className="font-semibold mb-4">Vista Previa Actual</h3>
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
                       {isLoading ? (
                           <Skeleton className="w-full h-full" />
                       ) : (
                           <MediaPreview src={imageUrl} />
                       )}
                    </div>
                </div>
                <div className="space-y-6">
                    <div>
                        <h3 className="font-semibold mb-2">Subir Nuevo Archivo</h3>
                         <Label htmlFor={`picture-${title}`} className={cn(
                             "flex flex-col items-center justify-center w-full h-32 border-2 border-border border-dashed rounded-lg cursor-pointer bg-muted/50",
                             isUploading ? "cursor-wait" : "hover:bg-muted"
                         )}>
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                {isUploading ? (
                                    <>
                                        <Loader2 className="w-8 h-8 mb-2 text-primary animate-spin" />
                                        <p className="text-sm text-primary">Subiendo...</p>
                                    </>
                                ) : (
                                    <>
                                        <UploadCloud className="w-8 h-8 mb-2 text-muted-foreground" />
                                        <p className="mb-2 text-sm text-muted-foreground">Haz clic para subir un archivo</p>
                                        <p className="text-xs text-muted-foreground">JPG, PNG, WEBP, GIF, WEBM, AVI</p>
                                    </>
                                )}
                            </div>
                            <Input id={`picture-${title}`} type="file" className="hidden" onChange={handleFileUpload} disabled={isUploading} />
                        </Label>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground">O</span>
                        </div>
                    </div>

                     <div>
                        <h3 className="font-semibold mb-2">Seleccionar de la Galería</h3>
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => setIsFileManagerOpen(true)}
                        >
                            <GalleryVertical className="mr-2 h-4 w-4" />
                            Abrir Gestor de Archivos
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
      </>
    );
}

export default function LogosPage() {
    const { toast } = useToast();
    const [config, setConfig] = useState({ 
        loginBackgroundImageUrl: '', 
        forgotPasswordBackgroundImageUrl: '' 
    });
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        const fetchConfig = async () => {
             setIsLoading(true);
             const result = await getAppConfig();
             if (result.success && result.data) {
                 setConfig(result.data);
             } else {
                 toast({
                     title: "Error al Cargar",
                     description: result.error || "No se pudo cargar la configuración de las portadas.",
                     variant: "destructive",
                 });
             }
             setIsLoading(false);
        };
        fetchConfig();
    }, [toast]);
    
    const handleConfigChange = (key: string, value: string) => {
        setConfig(prevConfig => ({ ...prevConfig, [key]: value }));
    };

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold mb-8">Configuración de Portadas de Autenticación</h1>
            
            <CoverSection
                title="Portada de Inicio de Sesión"
                description="Este fondo se mostrará en la página de login del usuario."
                icon={ImageIcon}
                configKey="loginBackgroundImageUrl"
                initialImageUrl={config.loginBackgroundImageUrl}
                onConfigChange={handleConfigChange}
                isLoading={isLoading}
            />

            <Separator />

            <CoverSection
                title="Portada de Olvidé Contraseña"
                description="Este fondo se mostrará en la página para restablecer la contraseña."
                icon={KeyIcon}
                configKey="forgotPasswordBackgroundImageUrl"
                initialImageUrl={config.forgotPasswordBackgroundImageUrl}
                onConfigChange={handleConfigChange}
                isLoading={isLoading}
            />

             <CardFooter>
                <p className="text-xs text-muted-foreground">
                    Los cambios se guardarán y reflejarán automáticamente en las páginas de autenticación.
                </p>
            </CardFooter>
        </div>
    );
}

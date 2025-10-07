
"use client";

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UploadCloud, Link as LinkIcon, Image as ImageIcon, Video, User, KeyRound as KeyIcon } from "lucide-react";
import appConfig from '@/app/lib/app-config.json';
import { useToast } from '@/hooks/use-toast';
import { MediaPreview } from '@/components/admin/media-preview';
import { Separator } from '@/components/ui/separator';

function CoverSection({ title, description, icon: Icon, imageUrl, setImageUrl, toast }: {
    title: string;
    description: string;
    icon: React.ElementType;
    imageUrl: string;
    setImageUrl: (url: string) => void;
    toast: (options: any) => void;
}) {
    const [newUrl, setNewUrl] = useState('');

    const handleUpdateByUrl = () => {
        if (newUrl.trim()) {
            setImageUrl(newUrl);
            toast({
                title: "Fondo actualizado",
                description: `La portada de ${title.toLowerCase()} se ha actualizado desde la URL.`,
            });
        }
    };
    
    return (
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
                        <MediaPreview src={imageUrl} />
                    </div>
                </div>
                <div className="space-y-6">
                    <div>
                        <h3 className="font-semibold mb-2">Subir Nuevo Archivo</h3>
                        <div className="flex flex-col items-center justify-center w-full">
                            <Label htmlFor={`picture-${title}`} className="flex flex-col items-center justify-center w-full h-32 border-2 border-border border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <UploadCloud className="w-8 h-8 mb-2 text-muted-foreground" />
                                    <p className="mb-2 text-sm text-muted-foreground">Haz clic para subir</p>
                                    <p className="text-xs text-muted-foreground">JPG, PNG, WEBP, GIF, WEBM, AVI</p>
                                </div>
                                <Input id={`picture-${title}`} type="file" className="hidden" />
                            </Label>
                        </div>
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
                        <h3 className="font-semibold mb-2">Actualizar desde URL</h3>
                        <div className="flex w-full items-center space-x-2">
                            <div className="relative flex-grow">
                                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                <Input
                                    type="url"
                                    placeholder="https://example.com/media.mp4"
                                    className="pl-10"
                                    value={newUrl}
                                    onChange={(e) => setNewUrl(e.target.value)}
                                />
                            </div>
                            <Button type="button" onClick={handleUpdateByUrl}>Actualizar</Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default function LogosPage() {
    const { toast } = useToast();
    const [loginBg, setLoginBg] = useState(appConfig.loginBackgroundImageUrl);
    const [signupBg, setSignupBg] = useState(appConfig.signupBackgroundImageUrl);
    const [forgotPasswordBg, setForgotPasswordBg] = useState(appConfig.forgotPasswordBackgroundImageUrl);

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold mb-8">Configuración de Logos y Portadas</h1>
            
            <CoverSection
                title="Portada de Autenticación"
                description="Este fondo se mostrará en la página de inicio de sesión del usuario."
                icon={ImageIcon}
                imageUrl={loginBg}
                setImageUrl={setLoginBg}
                toast={toast}
            />

            <Separator />

            <CoverSection
                title="Portada de Registro"
                description="Este fondo se mostrará en la página de registro de nuevos usuarios."
                icon={User}
                imageUrl={signupBg}
                setImageUrl={setSignupBg}
                toast={toast}
            />

            <Separator />

            <CoverSection
                title="Portada de Olvidé Contraseña"
                description="Este fondo se mostrará en la página para restablecer la contraseña."
                icon={KeyIcon}
                imageUrl={forgotPasswordBg}
                setImageUrl={setForgotPasswordBg}
                toast={toast}
            />

             <CardFooter>
                <p className="text-xs text-muted-foreground">
                    Los cambios se guardarán y reflejarán automáticamente en las páginas de autenticación.
                </p>
            </CardFooter>
        </div>
    );
}

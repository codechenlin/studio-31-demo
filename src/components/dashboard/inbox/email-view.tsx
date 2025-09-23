
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { CornerDownLeft, Eye, EyeOff, FolderOpen, Trash2, Archive, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { type Email } from './email-list';

interface EmailViewProps {
  email: Email | null;
}

export function EmailView({ email }: EmailViewProps) {
  const [showImages, setShowImages] = useState(false);

  useEffect(() => {
    // Reset image visibility when a new email is selected
    setShowImages(false);
  }, [email]);

  if (!email) {
    return (
      <Card className="h-full flex items-center justify-center bg-card/50">
        <div className="text-center text-muted-foreground">
          <FolderOpen className="mx-auto size-12 mb-4"/>
          <p>Selecciona un correo para leerlo</p>
        </div>
      </Card>
    );
  }

  const sanitizedBody = showImages
    ? email.body
    : email.body.replace(/<img[^>]*>/g, (match) => {
        const alt = match.match(/alt="([^"]*)"/)?.[1] || 'Imagen bloqueada';
        const aiHint = match.match(/data-ai-hint="([^"]*)"/)?.[1] || 'image';
        return `
          <div class="my-4 p-4 rounded-lg bg-muted/50 border border-dashed flex items-center gap-4 text-sm text-muted-foreground">
            <div class="p-3 bg-background rounded-full border">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shield-off"><path d="M19.69 14a6.9 6.9 0 0 0 .31-2V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m2 2 20 20"/></svg>
            </div>
            <div>
              <p class="font-semibold text-foreground">Contenido externo bloqueado</p>
              <p>Esta imagen (${alt}) fue bloqueada para proteger tu privacidad.</p>
              <p class="text-xs font-mono text-muted-foreground/70" >AI Hint: ${aiHint}</p>
            </div>
          </div>
        `;
      });

  return (
    <Card className="h-[70vh] flex flex-col">
      <CardHeader className="p-4 border-b">
        <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold truncate">{email.subject}</h2>
            <div className="flex items-center gap-2">
                 <Button variant="ghost" size="icon"><Trash2 className="size-4"/></Button>
                 <Button variant="ghost" size="icon"><Archive className="size-4"/></Button>
                 <Button variant="ghost" size="icon"><Clock className="size-4"/></Button>
                 <Button variant="ghost" size="icon"><CornerDownLeft className="size-4"/></Button>
            </div>
        </div>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
            <p>De: <span className="font-medium text-foreground">{email.from}</span></p>
            <p>{format(email.date, "d 'de' MMMM, yyyy 'a las' p", { locale: es })}</p>
        </div>
        {!showImages && email.body.includes('<img') && (
            <div className="mt-2 p-2 rounded-md bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-between gap-2">
                <p className="text-xs text-yellow-700 dark:text-yellow-300">
                    <EyeOff className="inline-block mr-2 size-4"/>
                    Se ha bloqueado la carga de imágenes para proteger tu privacidad.
                </p>
                <Button size="sm" variant="outline" className="shrink-0" onClick={() => setShowImages(true)}>
                    <Eye className="mr-2 size-4"/>
                    Cargar Imágenes
                </Button>
            </div>
        )}
      </CardHeader>
      <ScrollArea className="flex-1">
        <CardContent className="p-6">
          <div
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: sanitizedBody }}
          />
        </CardContent>
      </ScrollArea>
    </Card>
  );
}

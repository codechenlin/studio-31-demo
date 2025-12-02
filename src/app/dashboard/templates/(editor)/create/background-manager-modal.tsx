
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ImageIcon, Link as LinkIcon, GalleryVertical, UploadCloud, RotateCw, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FileManagerModal } from '@/components/dashboard/file-manager-modal';

type BackgroundFit = 'cover' | 'contain' | 'auto';

interface BackgroundImageState {
    url: string;
    fit: BackgroundFit;
    positionX: number;
    positionY: number;
    zoom: number;
}

interface BackgroundManagerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: (newState?: BackgroundImageState) => void;
  initialValue?: BackgroundImageState;
}

export function BackgroundManagerModal({ open, onOpenChange, onApply, initialValue }: BackgroundManagerModalProps) {
    const [state, setState] = useState<BackgroundImageState>(initialValue || {
        url: '',
        fit: 'cover',
        positionX: 50,
        positionY: 50,
        zoom: 100,
    });
    const [isFileManagerOpen, setIsFileManagerOpen] = useState(false);

    useEffect(() => {
        if (open) {
            setState(initialValue || { url: '', fit: 'cover', positionX: 50, positionY: 50, zoom: 100 });
        }
    }, [open, initialValue]);
    
    const handleFileSelect = (url: string) => {
        setState(prev => ({...prev, url}));
        setIsFileManagerOpen(false);
    }

    const handleApply = () => {
        onApply(state.url ? state : undefined);
    };
    
    const handleRemove = () => {
        onApply(undefined);
    }

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2"><ImageIcon /> Gestionar Imagen de Fondo</DialogTitle>
                        <DialogDescription>
                            Añade, ajusta o elimina la imagen de fondo para este contenedor.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-6 py-4">
                        <div className="col-span-1 space-y-4">
                            <Tabs defaultValue="url">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="url"><LinkIcon /> URL</TabsTrigger>
                                    <TabsTrigger value="gallery"><GalleryVertical /> Galería</TabsTrigger>
                                </TabsList>
                                <TabsContent value="url" className="space-y-2">
                                    <Label htmlFor="bg-url">URL de la Imagen</Label>
                                    <Input id="bg-url" value={state.url} onChange={e => setState(s => ({...s, url: e.target.value}))} placeholder="https://example.com/image.png" />
                                </TabsContent>
                                <TabsContent value="gallery" className="space-y-2">
                                     <Label>Seleccionar de la Galería</Label>
                                     <Button variant="outline" className="w-full" onClick={() => setIsFileManagerOpen(true)}>
                                         <GalleryVertical className="mr-2"/> Abrir Galería
                                     </Button>
                                </TabsContent>
                            </Tabs>
                            <div className="space-y-2">
                                <Label>Ajuste de Fondo</Label>
                                <div className="flex gap-2">
                                    {['cover', 'contain', 'auto'].map(fit => (
                                        <Button key={fit} variant={state.fit === fit ? 'secondary' : 'outline'} onClick={() => setState(s => ({...s, fit: fit as BackgroundFit}))} className="capitalize flex-1">{fit}</Button>
                                    ))}
                                </div>
                            </div>

                            {state.fit === 'auto' && (
                               <div className="space-y-2">
                                   <Label>Zoom ({state.zoom}%)</Label>
                                   <Slider value={[state.zoom]} onValueChange={([v]) => setState(s => ({...s, zoom: v}))} min={10} max={200} step={1} />
                               </div>
                            )}

                             <div className="space-y-2">
                                <Label>Posición Horizontal ({state.positionX}%)</Label>
                                <Slider value={[state.positionX]} onValueChange={([v]) => setState(s => ({...s, positionX: v}))} min={0} max={100} step={1} />
                            </div>
                             <div className="space-y-2">
                                <Label>Posición Vertical ({state.positionY}%)</Label>
                                <Slider value={[state.positionY]} onValueChange={([v]) => setState(s => ({...s, positionY: v}))} min={0} max={100} step={1} />
                            </div>
                        </div>
                        <div className="col-span-1 flex flex-col items-center justify-center">
                            <Label>Vista Previa</Label>
                             <div className="mt-2 w-full aspect-video rounded-md border bg-muted overflow-hidden flex items-center justify-center">
                                {state.url ? (
                                    <div 
                                      className="w-full h-full" 
                                      style={{ 
                                          backgroundImage: `url(${state.url})`,
                                          backgroundSize: state.fit === 'auto' ? `${state.zoom}%` : state.fit,
                                          backgroundPosition: `${state.positionX}% ${state.positionY}%`,
                                          backgroundRepeat: 'no-repeat'
                                      }}
                                    />
                                ) : (
                                    <ImageIcon className="text-muted-foreground size-12"/>
                                )}
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="justify-between">
                         <Button variant="destructive" onClick={handleRemove} disabled={!initialValue}>
                             <Trash2 className="mr-2"/> Eliminar Fondo
                         </Button>
                         <div className="flex gap-2">
                            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
                            <Button onClick={handleApply}>Aplicar Cambios</Button>
                         </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <FileManagerModal open={isFileManagerOpen} onOpenChange={setIsFileManagerOpen} onFileSelect={handleFileSelect} />
        </>
    );
}

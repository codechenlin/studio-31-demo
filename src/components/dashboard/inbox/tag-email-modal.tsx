
"use client";

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Check, PlusCircle, Tag, Tags, X, Repeat, History, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ColorPickerAdvanced } from '../color-picker-advanced';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

export interface AppliedTag {
  name: string;
  color: string;
}

interface TagEmailModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSave: (tag: AppliedTag) => void;
  initialTag: AppliedTag | null;
  senderEmail: string;
}

const existingTags: AppliedTag[] = [
  { name: 'Importante', color: '#ef4444' },
  { name: 'Seguimiento', color: '#f97316' },
  { name: 'Proyecto Alpha', color: '#3b82f6' },
  { name: 'Facturas', color: '#16a34a' },
];

export function TagEmailModal({ isOpen, onOpenChange, onSave, initialTag, senderEmail }: TagEmailModalProps) {
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#8b5cf6');
  const [selectedExistingTag, setSelectedExistingTag] = useState<AppliedTag | null>(null);
  const [isConfirmCancelOpen, setIsConfirmCancelOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialTag) {
        const isExisting = existingTags.find(t => t.name === initialTag.name && t.color === initialTag.color);
        if (isExisting) {
          setSelectedExistingTag(isExisting);
          setNewTagName('');
          setNewTagColor('#8b5cf6');
        } else {
          setSelectedExistingTag(null);
          setNewTagName(initialTag.name);
          setNewTagColor(initialTag.color);
        }
      }
    } else {
      // Reset on close
      setNewTagName('');
      setNewTagColor('#8b5cf6');
      setSelectedExistingTag(null);
    }
  }, [isOpen, initialTag]);

  const isCreatingNew = newTagName !== '' || newTagColor !== '#8b5cf6';
  
  const previewTag = selectedExistingTag || (isCreatingNew ? { name: newTagName || 'NombreEtiqueta', color: newTagColor } : null);

  const handleCancel = () => {
    if (isCreatingNew && (!initialTag || newTagName !== initialTag.name || newTagColor !== initialTag.color)) {
      setIsConfirmCancelOpen(true);
    } else {
      handleClose();
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setIsConfirmCancelOpen(false);
    setTimeout(() => {
      setNewTagName('');
      setNewTagColor('#8b5cf6');
      setSelectedExistingTag(null);
    }, 300);
  };
  
  const handleSelectExisting = (tag: AppliedTag) => {
    setSelectedExistingTag(tag);
    setNewTagName('');
    setNewTagColor('#8b5cf6');
  }
  
  const handleSave = () => {
    if (previewTag) {
        onSave(previewTag);
        handleClose();
    }
  }

  const truncateEmail = (email: string, maxLength = 30) => {
    if (email.length <= maxLength) return email;
    return `${email.substring(0, maxLength)}...`;
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-5xl w-full h-[550px] flex flex-col p-0 gap-0 bg-zinc-900/90 backdrop-blur-xl border border-cyan-400/20 text-white overflow-hidden">
            <DialogHeader className="sr-only">
                <DialogTitle>Etiquetar Correo</DialogTitle>
                <DialogDescription>
                    Aplica una etiqueta existente o crea una nueva para organizar este correo.
                </DialogDescription>
            </DialogHeader>
           <style>{`
                .info-grid {
                    background-image:
                        linear-gradient(to right, hsl(190 100% 50% / 0.1) 1px, transparent 1px),
                        linear-gradient(to bottom, hsl(190 100% 50% / 0.1) 1px, transparent 1px);
                    background-size: 2rem 2rem;
                }
                .scan-line-info {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 3px;
                    background: radial-gradient(ellipse 50% 100% at 50% 0%, hsl(190 100% 50% / 0.5), transparent 80%);
                    animation: scan-info 5s infinite linear;
                }
                @keyframes scan-info {
                    0% { transform: translateY(-10px); }
                    100% { transform: translateY(100vh); }
                }
            `}</style>
            <div className="flex-1 flex overflow-hidden">
              <div className="w-1/3 flex flex-col border-r border-cyan-400/20 bg-black/30 p-6">
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 shrink-0">
                  <Tags className="text-cyan-400" />
                  Etiquetas Existentes
                </h3>
                <ScrollArea className="flex-1 -mr-4 pr-4 custom-scrollbar">
                  <div className="space-y-2">
                    {existingTags.map((tag) => (
                      <button
                        key={tag.name}
                        onClick={() => handleSelectExisting(tag)}
                        className={cn(
                          "w-full text-left p-3 rounded-lg flex items-center justify-between transition-all duration-200 border-2",
                          selectedExistingTag?.name === tag.name
                            ? "bg-cyan-500/20 border-cyan-400"
                            : "bg-black/20 border-transparent hover:bg-cyan-500/10 hover:border-cyan-400/50"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <div className="size-4 rounded-full" style={{ backgroundColor: tag.color }} />
                          <span className="font-medium text-sm">{tag.name}</span>
                        </div>
                        {selectedExistingTag?.name === tag.name && <Check className="size-5 text-cyan-300" />}
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </div>
              
              <div className="w-1/3 flex flex-col p-6 border-r border-cyan-400/20">
                  <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 shrink-0">
                    <PlusCircle className="text-cyan-400" />
                    {initialTag ? 'Editar Etiqueta' : 'Crear Nueva Etiqueta'}
                  </h3>
                   <ScrollArea className="flex-1 -mr-6 pr-6 custom-scrollbar">
                      <div className="flex flex-col justify-center flex-grow space-y-6">
                          <div className="w-10/12 mx-auto">
                              <Label htmlFor="tag-name" className="text-center block mb-1">Nombre de la Etiqueta</Label>
                              <Input
                                id="tag-name"
                                value={newTagName}
                                onChange={(e) => {
                                  setNewTagName(e.target.value);
                                  setSelectedExistingTag(null);
                                }}
                                placeholder="Ej: Prioridad Alta"
                                className="mt-1 bg-black/30 border-cyan-400/30 text-center"
                              />
                          </div>
                          <div className="w-10/12 mx-auto">
                              <Label className="text-center block mb-1">Color de la Etiqueta</Label>
                              <ColorPickerAdvanced
                                  color={newTagColor}
                                  setColor={(color) => {
                                      setNewTagColor(color);
                                      setSelectedExistingTag(null);
                                  }}
                                  className="mt-1"
                              />
                          </div>
                      </div>
                      <Separator className="my-6 bg-cyan-400/10"/>
                      <div className="space-y-4">
                          <h4 className="text-sm font-semibold flex items-center gap-2"><Bot className="text-cyan-300"/> Automatización de Etiquetado</h4>
                          <div className="flex items-start space-x-3 p-3 rounded-md bg-black/20 border border-cyan-400/10">
                              <Checkbox id="tag-future" />
                              <div className="grid gap-1.5 leading-none">
                                  <label htmlFor="tag-future" className="text-sm font-medium leading-none flex items-center gap-2">
                                      <Repeat className="size-4"/>
                                      Etiquetar correos futuros
                                  </label>
                                  <p className="text-xs text-muted-foreground">
                                      Aplicar esta etiqueta automáticamente a todos los correos nuevos del remitente:
                                  </p>
                                  <p className="text-xs text-cyan-300/80 font-mono truncate">{truncateEmail(senderEmail)}</p>
                              </div>
                          </div>
                          <div className="flex items-start space-x-3 p-3 rounded-md bg-black/20 border border-cyan-400/10">
                              <Checkbox id="tag-past" />
                              <div className="grid gap-1.5 leading-none">
                                  <label htmlFor="tag-past" className="text-sm font-medium leading-none flex items-center gap-2">
                                      <History className="size-4"/>
                                      Etiquetar correos anteriores
                                  </label>
                                  <p className="text-xs text-muted-foreground">
                                      Buscar y aplicar esta etiqueta a todos los correos existentes del remitente:
                                  </p>
                                  <p className="text-xs text-cyan-300/80 font-mono truncate">{truncateEmail(senderEmail)}</p>
                              </div>
                          </div>
                      </div>
                    </ScrollArea>
              </div>
              
              <div className="w-1/3 flex flex-col relative overflow-hidden info-grid p-6">
                 <div className="scan-line-info" />
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 z-10 shrink-0">
                  <Tag className="text-cyan-400" />
                  Vista Previa
                </h3>
                 <div className="flex-1 flex items-center justify-center z-10">
                   {previewTag ? (
                    <div
                        className="px-4 py-2 rounded-full text-base font-bold flex items-center gap-3 shadow-lg"
                        style={{
                          backgroundColor: previewTag.color,
                          color: '#ffffff',
                          border: `2px solid rgba(255, 255, 255, 0.7)`,
                          boxShadow: `0 0 20px ${previewTag.color}`
                        }}
                      >
                        <Tag className="size-5" />
                        {previewTag.name}
                      </div>
                   ) : <div className="text-sm text-cyan-200/50">Selecciona o crea una etiqueta</div> }
                </div>
              </div>
            </div>
            <DialogFooter className="p-4 border-t border-cyan-400/20 shrink-0 bg-black/30">
                <Button variant="outline" className="border-destructive/50 text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={handleCancel}>Cancelar</Button>
                <Button className="bg-cyan-600 hover:bg-cyan-500 text-white" onClick={handleSave} disabled={!previewTag}>Guardar Etiqueta</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
      <AlertDialog open={isConfirmCancelOpen} onOpenChange={setIsConfirmCancelOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>¿Descartar cambios?</AlertDialogTitle>
                <AlertDialogDescription>
                    Has empezado a crear o editar una etiqueta. Si cancelas, se perderá la información no guardada.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Continuar editando</AlertDialogCancel>
                <AlertDialogAction onClick={handleClose} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Sí, descartar
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

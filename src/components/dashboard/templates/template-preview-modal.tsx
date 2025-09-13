
'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { type TemplateWithAuthor } from '@/app/dashboard/templates/actions';
import { TemplateRenderer } from './template-renderer';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Eye } from 'lucide-react';

interface TemplatePreviewModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  template: TemplateWithAuthor | null;
}

export function TemplatePreviewModal({ isOpen, onOpenChange, template }: TemplatePreviewModalProps) {
  if (!template) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl w-full h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="flex items-center gap-2"><Eye/> Vista Previa de la Plantilla</DialogTitle>
          <DialogDescription>
            Así es como se verá la plantilla &quot;{template.name}&quot; en la bandeja de entrada del cliente.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-1 bg-muted/20">
            <div className="w-full h-full scale-[0.8] origin-top">
                 <TemplateRenderer content={template.content} />
            </div>
        </ScrollArea>
        <DialogFooter className="p-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

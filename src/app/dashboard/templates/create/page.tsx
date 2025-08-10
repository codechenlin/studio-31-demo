
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Toggle } from '@/components/ui/toggle';
import {
  Square,
  Type,
  Image as ImageIcon,
  Columns,
  Minus,
  ArrowLeft,
  ChevronsUpDown,
  Laptop,
  Smartphone,
  Undo,
  Redo,
  Save,
  Rocket,
  Palette,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Bold,
  Italic,
  Underline,
  Heading1,
  LayoutGrid
} from 'lucide-react';

// Mock data for UI elements
const contentBlocks = [
  { name: "Columns", icon: Columns },
  { name: "Heading", icon: Heading1 },
  { name: "Text", icon: Type },
  { name: "Image", icon: ImageIcon },
  { name: "Button", icon: Square },
  { name: "Separator", icon: Minus },
];

export default function CreateTemplatePage() {
  return (
    <div className="flex h-screen max-h-screen bg-background text-foreground overflow-hidden">
      {/* Left Panel: Content & Blocks */}
      <aside className="w-80 border-r flex flex-col">
        <div className="p-4 border-b flex items-center gap-2">
            <LayoutGrid className="text-primary"/>
            <h2 className="text-lg font-semibold">Bloques de Contenido</h2>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-4 grid grid-cols-2 gap-4">
            {contentBlocks.map((block) => (
              <Card 
                key={block.name} 
                className="group flex flex-col items-center justify-center p-4 aspect-square cursor-grab transition-all hover:bg-primary/10 hover:border-primary/50 hover:shadow-lg"
              >
                <block.icon className="size-8 mb-2 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="text-sm font-medium text-center">{block.name}</span>
              </Card>
            ))}
          </div>
        </ScrollArea>
        <div className="p-2 border-t">
             <Button variant="outline" className="w-full"><ArrowLeft className="mr-2"/> Volver a Plantillas</Button>
        </div>
      </aside>

      {/* Center Panel: Editor/Canvas */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between p-2 border-b bg-card/50 backdrop-blur-sm">
            <div className="flex items-center gap-2">
                <Input defaultValue="Plantilla sin título" className="text-lg font-semibold border-none focus-visible:ring-0 focus-visible:ring-offset-0 w-auto"/>
            </div>
            <div className="flex items-center gap-2">
              <Toggle size="sm"><Laptop/></Toggle>
              <Toggle size="sm"><Smartphone/></Toggle>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm"><Undo/> Deshacer</Button>
                <Button variant="ghost" size="sm"><Redo/> Rehacer</Button>
                <Button variant="outline" size="sm" className="border-primary/50 text-primary"><Save/> Guardar Borrador</Button>
                 <div className="group rounded-md p-0.5 bg-gradient-to-r from-primary to-accent/80 transition-colors">
                    <Button className="bg-background dark:bg-card hover:bg-background/80 dark:hover:bg-card/80 text-foreground">
                        <Rocket className="mr-2"/> Publicar
                    </Button>
                </div>
            </div>
        </header>
        <div className="flex-1 bg-muted/40 p-8 overflow-auto">
            <div className="bg-white dark:bg-card max-w-3xl mx-auto shadow-2xl rounded-lg h-[1200px] p-8">
               <div className="border-2 border-dashed border-border/60 rounded-lg h-full flex items-center justify-center text-muted-foreground">
                   <p>Arrastra un bloque para empezar a construir tu plantilla.</p>
               </div>
            </div>
        </div>
      </main>

      {/* Right Panel: Style & Configuration */}
      <aside className="w-80 border-l flex flex-col">
         <Tabs defaultValue="style" className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-2 m-2">
                <TabsTrigger value="style"><Palette className="mr-2"/> Estilo</TabsTrigger>
                <TabsTrigger value="config"><ChevronsUpDown className="mr-2"/> Capas</TabsTrigger>
            </TabsList>
            <Separator />
            <ScrollArea className="flex-1">
                <TabsContent value="style" className="p-4">
                    <div className="space-y-6">
                        <Accordion type="single" collapsible defaultValue="item-1">
                            <AccordionItem value="item-1">
                                <AccordionTrigger>Dimensiones</AccordionTrigger>
                                <AccordionContent className="space-y-4">
                                     <div className="grid grid-cols-2 gap-2">
                                        <div><Label>Ancho</Label><Input placeholder="600px"/></div>
                                        <div><Label>Alto</Label><Input placeholder="Auto"/></div>
                                    </div>
                                    <div><Label>Padding</Label><Input placeholder="16px"/></div>
                                </AccordionContent>
                            </AccordionItem>
                             <AccordionItem value="item-2">
                                <AccordionTrigger>Tipografía</AccordionTrigger>
                                <AccordionContent className="space-y-4">
                                    <div>
                                        <Label>Fuente</Label>
                                        <Select>
                                            <SelectTrigger><SelectValue placeholder="Seleccionar fuente" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="arial">Arial</SelectItem>
                                                <SelectItem value="helvetica">Helvetica</SelectItem>
                                                <SelectItem value="georgia">Georgia</SelectItem>
                                                <SelectItem value="times">Times New Roman</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div><Label>Tamaño</Label><Input placeholder="16px"/></div>
                                        <div><Label>Peso</Label><Input placeholder="Normal"/></div>
                                    </div>
                                     <div className="grid grid-cols-4 gap-1">
                                        <Toggle><Bold/></Toggle>
                                        <Toggle><Italic/></Toggle>
                                        <Toggle><Underline/></Toggle>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-3">
                                <AccordionTrigger>Fondo y Borde</AccordionTrigger>
                                <AccordionContent className="space-y-4">
                                    <div><Label>Color de Fondo</Label><Input placeholder="#FFFFFF"/></div>
                                    <div><Label>Color de Borde</Label><Input placeholder="#DDDDDD"/></div>
                                    <div><Label>Radio del Borde</Label><Slider defaultValue={[8]} max={40} step={1} /></div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </TabsContent>
                <TabsContent value="config" className="p-4 text-center text-muted-foreground">
                    <p className="text-sm">El panel de capas aparecerá aquí.</p>
                </TabsContent>
            </ScrollArea>
        </Tabs>
      </aside>
    </div>
  );
}

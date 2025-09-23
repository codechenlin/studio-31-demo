
"use client";

import React from 'react';
import { ShieldAlert, Database, Search, ChevronDown, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';

export default function BouncesPage() {
  return (
    <main className="flex-1 p-4 md:p-8 bg-background/90 relative overflow-hidden">
      <div 
        className="absolute inset-0 z-0 opacity-[0.05] bg-grid-red-500/[0.2] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_70%,transparent_100%)]"
      />
      <div className="relative z-10">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-amber-400 flex items-center gap-3">
            <ShieldAlert className="size-8"/>
            Buzón de Rebotes
          </h1>
          <p className="text-muted-foreground mt-1">
            Analiza los correos que no pudieron ser entregados para mejorar la salud de tus listas.
          </p>
        </header>

        <Card className="bg-card/80 backdrop-blur-sm border-border/50 shadow-lg mb-6">
          <CardContent className="p-4 flex flex-col md:flex-row items-center gap-4">
            <div className="flex-1 flex items-center gap-4 w-full">
              <Select defaultValue="domain1">
                <SelectTrigger className="w-full md:w-[250px] bg-background/70">
                  <div className="flex items-center gap-2">
                    <Database className="size-4" />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="domain1">ejemplo.com</SelectItem>
                  <SelectItem value="domain2">mi-negocio.co</SelectItem>
                </SelectContent>
              </Select>
               <Select defaultValue="all">
                <SelectTrigger className="w-full md:w-[250px] bg-background/70">
                   <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las direcciones</SelectItem>
                  <SelectItem value="address1">ventas@ejemplo.com</SelectItem>
                  <SelectItem value="address2">soporte@ejemplo.com</SelectItem>
                </SelectContent>
              </Select>
            </div>
             <div className="relative w-full md:w-auto md:min-w-[300px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input placeholder="Buscar por destinatario o asunto..." className="pl-10 bg-background/70" />
            </div>
            <Button variant="outline" className="w-full md:w-auto">
              <Filter className="mr-2" />
              Filtros Avanzados
            </Button>
          </CardContent>
        </Card>

        <div className="border-2 border-dashed border-red-500/30 rounded-xl min-h-[50vh] flex flex-col items-center justify-center text-center p-8 bg-red-900/10">
            <div className="relative mb-4">
                <div className="absolute inset-0 bg-red-500/20 rounded-full animate-ping"/>
                <ShieldAlert className="relative z-10 size-20 text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-red-300">Bandeja de Rebotes Vacía</h2>
            <p className="text-red-200/70 mt-2 max-w-md">
              No se han detectado rebotes. Este es el lugar donde aparecerán los correos que no se pudieron entregar, permitiéndote diagnosticar y solucionar problemas.
            </p>
        </div>
      </div>
    </main>
  );
}

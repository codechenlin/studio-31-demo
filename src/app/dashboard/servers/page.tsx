
"use client";

import React, { useState } from 'react';
import { useForm, FormProvider, useFormContext, type SubmitHandler, type FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, CheckCircle, KeyRound, Lock, Server, Sparkles, Wand2 } from "lucide-react";
import { cn } from '@/lib/utils';

// Schemas for each provider
const awsSchema = z.object({
  apiKey: z.string().min(1, "API Key es requerida."),
  apiSecret: z.string().min(1, "API Secret es requerido."),
});
const mailgunSchema = z.object({
  apiKey: z.string().min(1, "API Key es requerida."),
  domain: z.string().min(1, "Dominio es requerido."),
});
const sendgridSchema = z.object({
  apiKey: z.string().min(1, "API Key es requerida."),
});
const elasticemailSchema = z.object({
  apiKey: z.string().min(1, "API Key es requerida."),
});
const blastengineSchema = z.object({
  username: z.string().min(1, "Username es requerido."),
  apiKey: z.string().min(1, "API Key es requerida."),
});
const sparkpostSchema = z.object({
  apiKey: z.string().min(1, "API Key es requerida."),
});
const smtpSchema = z.object({
  host: z.string().min(1, "Host es requerido."),
  port: z.string().min(1, "Puerto es requerido."),
  username: z.string().min(1, "Usuario es requerido."),
  password: z.string().min(1, "Contraseña es requerida."),
});

type ProviderSchema = 
  | typeof awsSchema
  | typeof mailgunSchema
  | typeof sendgridSchema
  | typeof elasticemailSchema
  | typeof blastengineSchema
  | typeof sparkpostSchema
  | typeof smtpSchema;

const providerConfig = {
  aws: { schema: awsSchema, fields: [{name: 'apiKey', label: 'Access Key ID', type: 'text'}, {name: 'apiSecret', label: 'Secret Access Key', type: 'password'}]},
  mailgun: { schema: mailgunSchema, fields: [{name: 'apiKey', label: 'API Key', type: 'password'}, {name: 'domain', label: 'Tu Dominio', type: 'text'}]},
  sendgrid: { schema: sendgridSchema, fields: [{name: 'apiKey', label: 'API Key', type: 'password'}]},
  elasticemail: { schema: elasticemailSchema, fields: [{name: 'apiKey', label: 'API Key', type: 'password'}]},
  blastengine: { schema: blastengineSchema, fields: [{name: 'username', label: 'Username', type: 'text'}, {name: 'apiKey', label: 'API Key', type: 'password'}]},
  sparkpost: { schema: sparkpostSchema, fields: [{name: 'apiKey', label: 'API Key', type: 'password'}]},
  smtp: { schema: smtpSchema, fields: [{name: 'host', label: 'Host SMTP', type: 'text'}, {name: 'port', label: 'Puerto', type: 'text'}, {name: 'username', label: 'Usuario', type: 'text'}, {name: 'password', label: 'Contraseña', type: 'password'}]},
} as const;

type ProviderName = keyof typeof providerConfig;


interface ProviderFormProps<T extends FieldValues> {
  provider: ProviderName;
  onSubmit: SubmitHandler<T>;
}

function ProviderForm<T extends FieldValues>({ provider, onSubmit }: ProviderFormProps<T>) {
  const { toast } = useToast();
  const config = providerConfig[provider];
  
  const methods = useForm<T>({
    resolver: zodResolver(config.schema as any),
    defaultValues: config.fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {})
  });

  const [isConnected, setIsConnected] = useState(false);

  const handleFormSubmit: SubmitHandler<T> = (data) => {
    console.log(`Connecting ${provider} with data:`, data);
    // Here you would call the actual API integration logic
    toast({
      title: `Conexión Exitosa con ${provider.toUpperCase()}`,
      description: "El proveedor ha sido configurado correctamente.",
    });
    setIsConnected(true);
    onSubmit(data);
  };
  
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
            {(config.fields as {name: string, label: string, type: string}[]).map((field) => (
               <FormField
                key={field.name}
                control={methods.control}
                name={field.name as any}
                render={({ field: formField }) => (
                  <FormItem>
                    <FormLabel>{field.label}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input 
                            type={field.type} 
                            placeholder={field.type === 'password' ? '••••••••••••••••' : `Tu ${field.label}`} 
                            {...formField} 
                            className="pl-10" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
        </div>
        <div className="flex justify-end">
            <Button 
                type="submit" 
                className="bg-gradient-to-r from-primary to-accent/80 hover:opacity-90 transition-opacity min-w-[150px]"
                disabled={isConnected}
            >
              {isConnected ? (
                <>
                    <CheckCircle className="mr-2" />
                    Conectado
                </>
              ) : (
                <>
                    <ArrowRight className="mr-2" />
                    Conectar
                </>
              )}
            </Button>
        </div>
      </form>
    </FormProvider>
  );
}

export default function ServersPage() {

  const handleConnect = (provider: ProviderName) => (data: FieldValues) => {
    console.log(`Provider: ${provider}`, data);
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 bg-background">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-muted-foreground flex items-center gap-2">
            <Server className="size-8"/>
            Servidores y Proveedores
          </h1>
          <p className="text-muted-foreground">Conecta tus servicios de envío de correo para empezar a crear campañas.</p>
        </div>
      </div>

       <Card className="bg-card/50 backdrop-blur-sm border-border/40 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="text-primary"/>
            <span>Configuración de Proveedor</span>
          </CardTitle>
          <CardDescription>
            Selecciona un proveedor de la lista e introduce tus credenciales para integrarlo con Mailflow AI.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="aws" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-7 h-auto">
              {Object.keys(providerConfig).map((p) => (
                <TabsTrigger key={p} value={p} className="capitalize py-2 text-xs md:text-sm">{p === 'smtp' ? 'SMTP Genérico' : p}</TabsTrigger>
              ))}
            </TabsList>
            
            {Object.keys(providerConfig).map((p) => (
              <TabsContent key={p} value={p}>
                <Card className="bg-background/50 border-none shadow-none mt-4">
                  <CardHeader>
                    <CardTitle className="capitalize">{p === 'smtp' ? 'Conectar a un Servidor SMTP' : `Conectar con ${p}`}</CardTitle>
                    <CardDescription>
                      Introduce tus credenciales de API para {p === 'smtp' ? 'tu servidor SMTP' : p}. Tus claves se guardarán de forma segura.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ProviderForm provider={p as ProviderName} onSubmit={handleConnect(p as ProviderName)} />
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </main>
  );
}

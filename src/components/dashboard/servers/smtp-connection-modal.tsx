
"use client";

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Globe, ArrowRight, Copy, Check, ShieldCheck, Search, AlertTriangle, KeyRound, Server as ServerIcon, AtSign, Mail, TestTube2, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { verifyDnsAction } from '@/app/dashboard/servers/actions';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';

interface SmtpConnectionModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

type VerificationStatus = 'idle' | 'pending' | 'verifying' | 'verified' | 'failed';
type TestStatus = 'idle' | 'testing' | 'success' | 'failed';

const generateVerificationCode = () => `demo_${Math.random().toString(36).substring(2, 10)}`;


export function SmtpConnectionModal({ isOpen, onOpenChange }: SmtpConnectionModalProps) {
  const { toast } = useToast();
  const [domain, setDomain] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>('idle');
  const [testStatus, setTestStatus] = useState<TestStatus>('idle');

  const smtpFormSchema = z.object({
    host: z.string().min(1, "El host es requerido."),
    port: z.coerce.number().min(1, "El puerto es requerido."),
    username: z.string().email("Debe ser un correo válido."),
    password: z.string().min(1, "La contraseña es requerida."),
    testEmail: z.string().email("El correo de prueba debe ser válido.")
  }).refine(data => data.username.endsWith(`@${domain}`), {
    message: `El correo debe pertenecer al dominio verificado (${domain})`,
    path: ["username"],
  });

  const form = useForm<z.infer<typeof smtpFormSchema>>({
    resolver: zodResolver(smtpFormSchema),
    defaultValues: {
      host: '',
      port: 587,
      username: '',
      password: '',
      testEmail: '',
    },
  });

  const txtRecordName = `_foxmiu-verification`;
  const txtRecordValue = `${domain},code=${verificationCode}`;

  const handleStartVerification = () => {
    if (!domain || !/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(domain)) {
      toast({
        title: "Dominio no válido",
        description: "Por favor, introduce un nombre de dominio válido.",
        variant: "destructive",
      });
      return;
    }
    setVerificationCode(generateVerificationCode());
    setVerificationStatus('pending');
    setCurrentStep(2);
  };
  
  const handleCheckVerification = async () => {
    setVerificationStatus('verifying');
    const result = await verifyDnsAction({
      domain,
      expectedTxt: txtRecordValue,
    });
    
    if (result.success) {
      setVerificationStatus('verified');
      form.setValue('username', `ejemplo@${domain}`);
    } else {
      setVerificationStatus('failed');
      toast({
        title: "Verificación Fallida",
        description: result.error,
        variant: "destructive",
      });
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
        title: "¡Copiado!",
        description: "El registro ha sido copiado al portapapeles.",
        className: 'bg-success-login border-none text-white'
    });
  }

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
        setCurrentStep(1);
        setDomain('');
        setVerificationCode('');
        setVerificationStatus('idle');
        setTestStatus('idle');
        form.reset();
    }, 300);
  }
  
  async function onSubmitSmtp(values: z.infer<typeof smtpFormSchema>) {
    setTestStatus('testing');
    // Simulate API call to test connection
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate success or failure
    if (values.password.toLowerCase() !== 'fail') {
      setTestStatus('success');
      toast({
        title: "¡Conexión Exitosa!",
        description: `Se ha enviado un correo de prueba a ${values.testEmail}.`,
        className: 'bg-green-500 text-white border-none'
      })
    } else {
       setTestStatus('failed');
       toast({
        title: "Fallo en la Conexión",
        description: "No se pudo autenticar con el servidor SMTP. Revisa tus credenciales.",
        variant: 'destructive'
      });
    }
  }

  const cardAnimation = {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
  };

  const renderStepContent = () => {
    switch (currentStep) {
        case 1:
            return (
                 <div className="py-4 space-y-4">
                    <p className="text-sm text-muted-foreground">
                    <b>Paso 1: Verificar Dominio.</b> Para asegurar la entregabilidad y autenticidad de tus correos, primero debemos verificar que eres el propietario del dominio desde el que quieres enviar.
                    </p>
                    <div className="space-y-2">
                    <Label htmlFor="domain">Tu Dominio</Label>
                    <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input 
                            id="domain" 
                            placeholder="ejemplo.com" 
                            className="pl-10"
                            value={domain}
                            onChange={(e) => setDomain(e.target.value)}
                        />
                    </div>
                    </div>
                    <Button className="w-full" onClick={handleStartVerification}>
                    Verificar Dominio <ArrowRight className="ml-2"/>
                    </Button>
                </div>
            )
        case 2:
            return (
                 <div className="py-4 space-y-4">
                    <p className="text-sm text-muted-foreground">
                        <b>Paso 2: Añadir Registro DNS.</b> Copia el siguiente registro TXT y añádelo a la configuración DNS de tu dominio <b>{domain}</b>.
                    </p>

                    <div className="space-y-3">
                        <div className="p-3 bg-muted/50 rounded-md text-sm font-mono border">
                            <Label className="text-xs font-sans text-muted-foreground">REGISTRO</Label>
                            <p className="flex justify-between items-center">{txtRecordName} <Copy className="size-4 cursor-pointer" onClick={() => handleCopy(txtRecordName)}/></p>
                        </div>
                         <div className="p-3 bg-muted/50 rounded-md text-sm font-mono border">
                            <Label className="text-xs font-sans text-muted-foreground">VALOR</Label>
                            <p className="flex justify-between items-center break-all">{txtRecordValue} <Copy className="size-4 cursor-pointer ml-2" onClick={() => handleCopy(txtRecordValue)}/></p>
                        </div>
                    </div>
                    
                    <AnimatePresence mode="wait">
                    {verificationStatus === 'pending' && (
                        <motion.div key="pending" {...cardAnimation}>
                             <Button className="w-full" onClick={handleCheckVerification}>
                                Ya he añadido el registro, verificar ahora
                            </Button>
                        </motion.div>
                    )}
                    {verificationStatus === 'verifying' && (
                        <motion.div key="verifying" {...cardAnimation} className="p-4 bg-blue-500/10 text-blue-300 rounded-lg flex items-center justify-center gap-3 text-center">
                            <div className="relative size-12">
                               <div className="absolute inset-0 border-2 border-blue-400/30 rounded-full"/>
                               <div className="absolute inset-0 border-t-2 border-blue-400 rounded-full animate-spin"/>
                               <Search className="absolute inset-0 m-auto size-6"/>
                            </div>
                            <div>
                                <h4 className="font-bold">Verificando...</h4>
                                <p className="text-xs">Buscando el registro DNS en el dominio.</p>
                            </div>
                        </motion.div>
                    )}
                     {verificationStatus === 'verified' && (
                        <motion.div key="verified" {...cardAnimation} className="p-4 bg-green-500/10 text-green-400 rounded-lg flex flex-col items-center gap-3 text-center">
                            <ShieldCheck className="size-10" />
                            <h4 className="font-bold">¡Dominio Verificado!</h4>
                            <p className="text-xs">El registro TXT se encontró correctamente.</p>
                             <Button className="w-full mt-2 bg-green-500 hover:bg-green-600 text-white" onClick={() => setCurrentStep(3)}>
                                Continuar <ArrowRight className="ml-2"/>
                            </Button>
                        </motion.div>
                    )}
                    {verificationStatus === 'failed' && (
                        <motion.div key="failed" {...cardAnimation} className="p-4 bg-red-500/10 text-red-400 rounded-lg flex flex-col items-center gap-3 text-center">
                            <AlertTriangle className="size-10" />
                            <h4 className="font-bold">Verificación Fallida</h4>
                            <p className="text-xs">No pudimos encontrar el registro. La propagación de DNS puede tardar. Por favor, inténtalo de nuevo en unos minutos.</p>
                             <Button variant="outline" className="w-full mt-2" onClick={handleCheckVerification}>
                                Reintentar Verificación
                            </Button>
                        </motion.div>
                    )}
                    </AnimatePresence>
                 </div>
            )
        case 3:
            return (
                <div className="py-4 space-y-4">
                     <p className="text-sm text-muted-foreground">
                        <b>Paso 3: Configurar Credenciales.</b> Proporciona los detalles de tu servidor SMTP.
                    </p>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmitSmtp)} className="space-y-4">
                           <div className="grid grid-cols-2 gap-4">
                             <FormField control={form.control} name="host" render={({ field }) => (
                                <FormItem><Label>Host</Label><FormControl><div className="relative"><ServerIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" /><Input className="pl-10" placeholder="smtp.ejemplo.com" {...field} /></div></FormControl><FormMessage /></FormItem>
                             )}/>
                             <FormField control={form.control} name="port" render={({ field }) => (
                                <FormItem><Label>Puerto</Label><FormControl><div className="relative"><Input type="number" placeholder="587" {...field} /></div></FormControl><FormMessage /></FormItem>
                             )}/>
                           </div>
                           <FormField control={form.control} name="username" render={({ field }) => (
                                <FormItem><Label>Usuario (Email)</Label><FormControl><div className="relative"><AtSign className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" /><Input className="pl-10" placeholder={`usuario@${domain}`} {...field} /></div></FormControl><FormMessage /></FormItem>
                           )}/>
                           <FormField control={form.control} name="password" render={({ field }) => (
                                <FormItem><Label>Contraseña</Label><FormControl><div className="relative"><KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" /><Input className="pl-10" type="password" placeholder="••••••••" {...field} /></div></FormControl><FormMessage /></FormItem>
                           )}/>

                           <div className="p-4 border rounded-lg bg-muted/30">
                              <p className="text-sm font-semibold mb-2">Verifica tu conexión</p>
                              <p className="text-xs text-muted-foreground mb-3">Enviaremos un correo de prueba para asegurar que todo esté configurado correctamente.</p>
                               <FormField control={form.control} name="testEmail" render={({ field }) => (
                                    <FormItem><Label>Enviar correo de prueba a:</Label><FormControl><div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" /><Input className="pl-10" placeholder="receptor@ejemplo.com" {...field} /></div></FormControl><FormMessage /></FormItem>
                               )}/>
                           </div>
                           
                           {testStatus !== 'success' && (
                                <Button type="submit" className="w-full" disabled={testStatus === 'testing'}>
                                    {testStatus === 'testing' ? <><TestTube2 className="mr-2 animate-pulse"/> Probando Conexión...</> : <><TestTube2 className="mr-2"/> Probar Conexión</>}
                                </Button>
                           )}
                           
                           <AnimatePresence mode="wait">
                               {testStatus === 'success' && (
                                   <motion.div key="success-smtp" {...cardAnimation} className="flex flex-col gap-3">
                                       <div className="p-4 bg-green-500/10 text-green-400 rounded-lg flex items-center justify-center gap-3 text-center">
                                           <CheckCircle className="size-8"/>
                                           <div>
                                               <h4 className="font-bold">Conexión Exitosa</h4>
                                               <p className="text-xs">El correo de prueba fue enviado. Revisa la bandeja de entrada.</p>
                                           </div>
                                       </div>
                                       <Button className="w-full bg-gradient-to-r from-primary to-accent/80 hover:opacity-90 transition-opacity" onClick={handleClose}>
                                           Finalizar y Guardar
                                       </Button>
                                   </motion.div>
                               )}
                                {testStatus === 'failed' && (
                                   <motion.div key="failed-smtp" {...cardAnimation} className="p-4 bg-red-500/10 text-red-400 rounded-lg flex items-center gap-3 text-center">
                                       <AlertTriangle className="size-8"/>
                                        <div>
                                           <h4 className="font-bold">Fallo en la Prueba</h4>
                                           <p className="text-xs">No se pudo enviar el correo de prueba. Verifica tus credenciales e inténtalo de nuevo.</p>
                                       </div>
                                   </motion.div>
                               )}
                           </AnimatePresence>

                        </form>
                    </Form>
                </div>
            )
        default: return null;
    }
  }


  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-card/80 backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle>Conectar a Servidor SMTP</DialogTitle>
          <DialogDescription>
            Sigue los pasos para conectar de forma segura tu servidor de correo.
          </DialogDescription>
        </DialogHeader>
        <AnimatePresence mode="wait">
            <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
            >
                {renderStepContent()}
            </motion.div>
        </AnimatePresence>
        <DialogFooter className="mt-4">
             {currentStep > 1 && (
                <Button variant="ghost" onClick={() => setCurrentStep(currentStep - 1)}>
                    Atrás
                </Button>
             )}
            <Button variant="outline" onClick={handleClose} className="ml-auto">Cerrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

    

"use client";

import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ShieldCheck, CheckCircle, BrainCircuit, Link, FileScan, UserCheck, Code, Fingerprint, Lock, ShieldQuestion, Eye, Server, Layers, Package, ScanSearch } from 'lucide-react';
import { motion } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface AntivirusStatusModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const analysisItems = [
    { icon: Link, title: "Análisis de Enlaces y Redirecciones", description: "Cada URL ha sido procesada en un entorno de sandbox virtualizado para neutralizar cualquier intento de phishing antes de que llegue a tu navegador. Nuestra IA ha confirmado que todos los enlaces son seguros." },
    { icon: ScanSearch, title: "Escaneo de Firmas y Comportamiento", description: "Hemos contrastado la firma digital de cada archivo adjunto con nuestra base de datos de 2 mil millones de amenazas conocidas y hemos ejecutado el contenido en un entorno simulado para predecir comportamientos maliciosos. No se detectaron anomalías." },
    { icon: UserCheck, title: "Verificación de Suplantación de Identidad (Spoofing)", description: "Se ha validado la autenticidad del remitente a través de los protocolos DMARC, DKIM y SPF. El Núcleo de IA confirma que el correo es legítimo y no una falsificación." },
    { icon: Code, title: "Detección de Scripts Maliciosos", description: "El código fuente del correo (HTML, CSS, JS) ha sido inspeccionado y saneado, eliminando cualquier script ofuscado o rutina diseñada para comprometer la seguridad de tus datos." },
    { icon: Fingerprint, title: "Análisis de Huella Digital", description: "Comparamos la 'huella digital' única de este correo con millones de muestras de nuestra base de datos global para descartar similitudes con campañas de phishing conocidas, garantizando su unicidad." },
    { icon: Package, title: "Detección de Bombas de Descompresión", description: "Se analizaron todos los archivos comprimidos (ZIP, RAR, etc.) para descartar 'bombas de descompresión', un tipo de ataque que busca agotar los recursos de tu sistema. El contenido es seguro." },
    { icon: FileScan, title: "Análisis de Macros en Documentos", description: "Los documentos de Office y PDFs adjuntos fueron escaneados en busca de macros maliciosas o scripts ocultos. No se encontró código ejecutable sospechoso en ninguno de los archivos." },
];

const protectionItems = [
    { title: "Escudo Criptográfico", description: "El correo fue validado con una firma criptográfica que asegura que su contenido no ha sido alterado desde que fue enviado." },
    { title: "Motor de Inferencia Neuronal", description: "Los patrones, estructura y metadatos del correo fueron comparados con modelos de ataque emergentes, sin encontrar correlaciones peligrosas." },
    { title: "Validación de Reputación Geodistribuida", description: "La reputación del remitente y la infraestructura de origen (IPs, dominios) fueron validadas como seguras en nuestra red global de inteligencia de amenazas." },
    { title: "Integridad de Contenido Verificada", description: "La IA ha verificado la coherencia entre el texto visible y el código subyacente, garantizando que no hay contenido malicioso oculto." },
];

export function AntivirusStatusModal({ isOpen, onOpenChange }: AntivirusStatusModalProps) {
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl w-full h-[650px] flex p-0 gap-0 bg-zinc-900/90 backdrop-blur-2xl border-2 border-cyan-400/30 text-white overflow-hidden" showCloseButton={false}>
          <div className="grid grid-cols-1 md:grid-cols-3 h-full w-full">
            {/* Section 1: Left Panel */}
            <div className="relative h-full w-full bg-black/30 flex flex-col items-center justify-between p-8 overflow-hidden border-r border-cyan-400/20">
                <div className="absolute inset-0 w-full h-full hexagonal-grid opacity-20" />
                <div className="absolute inset-0 w-full h-full radar-scanner" />
                
                <motion.div 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 150, damping: 20 }}
                    className="relative z-10 flex flex-col items-center text-center gap-6"
                >
                     <div className="relative p-6">
                        <svg className="absolute inset-0 w-full h-full animate-[hud-spin_15s_linear_infinite]" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="48" stroke="rgba(0,173,236,0.2)" strokeWidth="0.5" fill="none" />
                            <path d="M 50,2 A 48,48 0 0,1 98,50" stroke="rgba(0,173,236,0.7)" strokeWidth="1" fill="none" strokeDasharray="3, 6" />
                             <circle className="pulse-dot" cx="20" cy="20" r="2" fill="#00ADEC"/>
                             <circle className="pulse-dot" cx="80" cy="80" r="2" fill="#00ADEC" style={{animationDelay: '1s'}}/>
                             <circle className="pulse-dot" cx="80" cy="20" r="2" fill="#00ADEC" style={{animationDelay: '0.5s'}}/>
                        </svg>
                        <ShieldCheck className="size-24 text-cyan-300 animate-[icon-pulse_4s_infinite_ease-in-out]" style={{ filter: 'drop-shadow(0 0 20px #00adec)' }}/>
                    </div>
                     <div className="p-3 rounded-lg bg-gradient-to-r from-[#00CE07]/20 to-[#A6EE00]/20 border border-[#00CE07]/50 flex items-center gap-3">
                        <CheckCircle className="size-6 text-[#A6EE00]"/>
                        <span className="font-semibold text-white text-lg">SISTEMA ACTIVO</span>
                    </div>
                    <p className="text-cyan-200/70 text-base">Nuestro núcleo de IA está analizando y protegiendo tu bandeja de entrada en tiempo real.</p>
                </motion.div>
                <div className="z-10 w-full pt-6">
                  <Button 
                    onClick={() => onOpenChange(false)} 
                    className="w-full h-12 text-base font-bold text-cyan-200 bg-cyan-900/50 border-2 border-cyan-500/50 rounded-lg hover:bg-cyan-800/70 hover:border-cyan-400 hover:text-white transition-all duration-300 ai-button-scan"
                  >
                    Entendido
                  </Button>
                </div>
            </div>

            {/* Section 2: Middle Panel */}
            <div className="flex flex-col h-full p-6 border-r border-cyan-400/20 bg-black/20 relative overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-10 bg-grid-blue-500/30"/>
                <DialogHeader className="text-left mb-4 z-10 shrink-0">
                    <DialogTitle className="text-xl font-bold text-cyan-300 flex items-center gap-2">
                        <BrainCircuit />
                        Análisis del Correo
                    </DialogTitle>
                </DialogHeader>
                <ScrollArea className="flex-1 -mr-3 pr-3 custom-scrollbar z-10">
                  <div className="space-y-4">
                    {analysisItems.map((item, index) => (
                        <React.Fragment key={item.title}>
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.15 + 0.4 }}
                            className="flex items-start gap-4"
                        >
                             <div className="relative p-2 bg-blue-950/50 rounded-full border border-blue-500/30">
                                <item.icon className="size-6 text-blue-300" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-semibold text-white">{item.title}</h4>
                                <p className="text-sm text-white/70">{item.description}</p>
                            </div>
                        </motion.div>
                        </React.Fragment>
                    ))}
                  </div>
                </ScrollArea>
            </div>

            {/* Section 3: Right Panel */}
            <div className="flex flex-col h-full p-6 bg-black/10 relative overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-30 bg-gradient-to-br from-green-900/20 via-transparent to-transparent"/>
                 <div className="relative z-10 text-center flex flex-col items-center">
                    <motion.div 
                        initial={{ scale: 0.8, opacity: 0}} 
                        animate={{ scale: 1, opacity: 1}} 
                        transition={{ delay: 0.5, duration: 0.5}}
                        className="relative p-2"
                    >
                      <CheckCircle className="size-16 text-green-300 mb-2 icon-check-pulse" style={{ filter: 'drop-shadow(0 0 10px #39FF14)'}}/>
                    </motion.div>
                    <motion.h2 
                      className="text-2xl font-bold tracking-tight text-reveal" 
                      style={{'--reveal-delay': '0.7s'} as React.CSSProperties}
                    >
                      Veredicto Final: <span className="text-green-300">Cero Amenazas</span>
                    </motion.h2>
                </div>
                 <div className="flex-1 grid grid-rows-4 gap-4 mt-6 z-10">
                      {protectionItems.map((item, index) => (
                        <motion.div
                            key={item.title}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.2 + 0.8 }}
                            className="flex items-start gap-4"
                        >
                            <div className="relative p-3 rounded-full bg-green-950/50">
                                <svg className="absolute inset-0 w-full h-full animate-[hud-spin_8s_linear_infinite]" viewBox="0 0 100 100" style={{ animationDelay: `${index * 0.3}s`}}>
                                    <defs>
                                      <linearGradient id="protection-ring-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#A6EE00" />
                                        <stop offset="100%" stopColor="#00CB07" />
                                      </linearGradient>
                                    </defs>
                                    <path d="M 50,5 A 45,45 0 0,1 95,50" stroke="url(#protection-ring-gradient)" strokeWidth="1.5" fill="none" strokeDasharray="5, 10" />
                                </svg>
                                <CheckCircle className="size-6 text-green-300" style={{ fill: 'rgba(0, 203, 7, 0.1)' }} />
                            </div>
                            <div className="pt-1">
                                <h4 className="font-semibold text-white">{item.title}</h4>
                                <p className="text-sm text-white/70">{item.description}</p>
                            </div>
                        </motion.div>
                      ))}
                </div>
            </div>
          </div>
      </DialogContent>
    </Dialog>
  );
}

    
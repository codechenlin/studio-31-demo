
"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Globe, GitBranch, Mail, X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

// Mock Data
const domains = [
    { name: 'mailflow.ai', verified: true, emails: ['ventas@mailflow.ai', 'soporte@mailflow.ai'] },
    { name: 'daybuu.com', verified: true, emails: ['contacto@daybuu.com'] },
];
const subdomains = [
    { name: 'marketing.mailflow.ai', verified: true, emails: ['newsletter@marketing.mailflow.ai'] },
    { name: 'app.daybuu.com', verified: false, emails: [] },
];

interface DomainManagerModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function DomainManagerModal({ isOpen, onOpenChange }: DomainManagerModalProps) {
    const [selectedDomain, setSelectedDomain] = useState<string | null>(domains[0]?.name || null);

    const getEmailsForDomain = () => {
        const domainData = [...domains, ...subdomains].find(d => d.name === selectedDomain);
        return domainData ? domainData.emails : [];
    }
    
    const emails = getEmailsForDomain();

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent showCloseButton={false} className="max-w-4xl w-full h-[650px] flex flex-col p-0 gap-0 bg-black/80 backdrop-blur-xl border border-cyan-400/20 text-white overflow-hidden">
                <style>{`
                    .info-grid {
                        background-image:
                            linear-gradient(to right, hsl(190 100% 50% / 0.1) 1px, transparent 1px),
                            linear-gradient(to bottom, hsl(190 100% 50% / 0.1) 1px, transparent 1px);
                        background-size: 2rem 2rem;
                    }
                `}</style>

                 <DialogHeader className="p-4 border-b border-cyan-400/20 bg-black/30 text-left z-10">
                    <DialogTitle className="flex items-center gap-3">
                         <div className="p-2 rounded-full bg-cyan-500/10 border-2 border-cyan-400/20">
                           <Globe className="text-cyan-300"/>
                        </div>
                        Gestor de Dominios y Correos
                    </DialogTitle>
                </DialogHeader>
                
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 min-h-0">
                    {/* Left Column: Domain List */}
                    <div className="flex flex-col p-6 border-r border-cyan-400/20 bg-black/20">
                        <ScrollArea className="flex-1 -m-6 p-6 custom-scrollbar">
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-semibold text-cyan-300 text-sm mb-2 flex items-center gap-2"><Globe className="size-4"/>Dominios Principales</h3>
                                    <div className="space-y-2">
                                        {domains.map(d => (
                                            <button key={d.name} onClick={() => setSelectedDomain(d.name)} className={cn("w-full text-left p-3 rounded-lg flex items-center justify-between transition-all duration-200 border-2", selectedDomain === d.name ? "bg-cyan-500/20 border-cyan-400" : "bg-black/20 border-transparent hover:bg-cyan-500/10 hover:border-cyan-400/50")}>
                                                <span className="font-mono text-sm">{d.name}</span>
                                                <div className={cn("size-2.5 rounded-full", d.verified ? "bg-green-400 shadow-[0_0_5px_#22c55e]" : "bg-red-500 shadow-[0_0_5px_#ef4444]")}/>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                     <h3 className="font-semibold text-cyan-300 text-sm mb-2 flex items-center gap-2"><GitBranch className="size-4"/>Subdominios</h3>
                                      <div className="space-y-2">
                                        {subdomains.map(d => (
                                            <button key={d.name} onClick={() => setSelectedDomain(d.name)} className={cn("w-full text-left p-3 rounded-lg flex items-center justify-between transition-all duration-200 border-2", selectedDomain === d.name ? "bg-cyan-500/20 border-cyan-400" : "bg-black/20 border-transparent hover:bg-cyan-500/10 hover:border-cyan-400/50")}>
                                                <span className="font-mono text-sm">{d.name}</span>
                                                <div className={cn("size-2.5 rounded-full", d.verified ? "bg-green-400 shadow-[0_0_5px_#22c55e]" : "bg-red-500 shadow-[0_0_5px_#ef4444]")}/>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </ScrollArea>
                    </div>
                    {/* Right Column: Email List */}
                    <div className="flex flex-col p-6 bg-black/10 info-grid relative">
                         <div className="absolute inset-0 scan-line-info" style={{'--scan-color': 'hsl(190 100% 50%)'} as React.CSSProperties} />
                         <div className="z-10 flex flex-col h-full">
                           <h3 className="font-semibold text-cyan-300 text-sm mb-2 flex items-center gap-2 shrink-0"><Mail className="size-4"/>Correos para: <span className="font-mono text-white">{selectedDomain}</span></h3>
                           <ScrollArea className="flex-1 -m-6 p-6 mt-4 custom-scrollbar">
                                <div className="space-y-2">
                                    {emails.length > 0 ? emails.map(email => (
                                        <div key={email} className="p-3 bg-black/40 border border-cyan-400/10 rounded-lg font-mono text-sm text-white/80">
                                            {email}
                                        </div>
                                    )) : (
                                        <div className="text-center text-cyan-200/50 pt-16">
                                            <p>No hay correos para este dominio.</p>
                                        </div>
                                    )}
                                </div>
                           </ScrollArea>
                        </div>
                    </div>
                </div>
                 <DialogFooter className="p-4 border-t border-cyan-400/20 bg-black/30 z-10">
                     <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="w-full bg-[#00ADEC] text-white border-white hover:bg-white hover:text-black"
                    >
                        <X className="mr-2"/>
                        Cerrar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

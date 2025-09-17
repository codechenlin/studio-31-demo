
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Eye, EyeOff, Mail, KeyRound, BrainCircuit, Bot, ChevronRight, User, CircleDashed, Shield, Layers, GitBranch, Cpu, Fingerprint } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

// --- Form 1: Holographic Interface ---
const HolographicForm = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState<string | null>(null);

  return (
    <Card className="bg-zinc-900/40 dark:bg-black/40 backdrop-blur-xl border-2 border-cyan-400/20 shadow-2xl shadow-cyan-500/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-cyan-500/[0.2] bg-grid-16 [mask-image:radial-gradient(ellipse_at_center,white_20%,transparent_100%)]"></div>
        <CardHeader className="text-center relative z-10">
            <div className="flex justify-center mb-4">
                <BrainCircuit className="size-16 text-cyan-400 animate-pulse" style={{ animationDuration: '3s' }} />
            </div>
            <CardTitle className="text-3xl font-bold text-cyan-200">Acceso Neuronal</CardTitle>
            <CardDescription className="text-cyan-400/70">Inicia sesión en la red sináptica.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 relative z-10">
            <div className="space-y-2">
                <Label htmlFor="email-1" className="text-cyan-300/80">ID de Usuario</Label>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-cyan-400/50" />
                    <Input id="email-1" type="email" placeholder="usuario@red.sinaptica" className="bg-cyan-950/30 border-cyan-400/30 text-white pl-10 focus:ring-cyan-400" onFocus={() => setIsFocused('email')} onBlur={() => setIsFocused(null)} />
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="password-1" className="text-cyan-300/80">Clave de Acceso</Label>
                <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-cyan-400/50" />
                    <Input id="password-1" type={isPasswordVisible ? 'text' : 'password'} placeholder="••••••••" className="bg-cyan-950/30 border-cyan-400/30 text-white pl-10 pr-10 focus:ring-cyan-400" onFocus={() => setIsFocused('password')} onBlur={() => setIsFocused(null)} />
                    <button type="button" onClick={() => setIsPasswordVisible(!isPasswordVisible)} className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-400/50 hover:text-cyan-300">
                        {isPasswordVisible ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                    </button>
                </div>
            </div>
            <Button className="w-full bg-cyan-400/90 text-black font-bold hover:bg-cyan-300 relative overflow-hidden group">
                <span className="absolute w-full h-full bg-white/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out" />
                <span className="relative z-10">Conectar</span>
            </Button>
        </CardContent>
    </Card>
  );
};

// --- Form 2: Minimalist AI Core ---
const AICoreForm = () => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => setIsSubmitting(false), 2000);
    };

    return (
        <Card className="bg-gray-100 dark:bg-zinc-900 border-border/50 shadow-lg relative w-full max-w-sm overflow-hidden">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <Bot className="size-8 text-primary" />
                    <div>
                        <CardTitle className="text-xl">AI Core Login</CardTitle>
                        <CardDescription>Autenticación requerida.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                     <div className="space-y-1">
                        <Label htmlFor="email-2">Identificador</Label>
                        <Input id="email-2" type="email" placeholder="ID de entidad" className="bg-background"/>
                    </div>
                     <div className="space-y-1">
                        <Label htmlFor="password-2">Token de Acceso</Label>
                        <div className="relative">
                            <Input id="password-2" type={isPasswordVisible ? "text" : "password"} placeholder="Token seguro" className="pr-10 bg-background" />
                             <button type="button" onClick={() => setIsPasswordVisible(!isPasswordVisible)} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground">
                                {isPasswordVisible ? <EyeOff /> : <Eye />}
                            </button>
                        </div>
                    </div>
                    <Button type="submit" className="w-full relative group">
                        <AnimatePresence>
                        {isSubmitting && (
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "100%" }}
                                exit={{ width: 0 }}
                                transition={{ duration: 1.8, ease: "linear" }}
                                className="absolute inset-0 bg-primary/50"
                            />
                        )}
                        </AnimatePresence>
                        <span className="relative z-10 flex items-center">
                            {isSubmitting ? "Verificando..." : "Autenticar"}
                            {!isSubmitting && <ChevronRight className="ml-2 transition-transform group-hover:translate-x-1"/>}
                        </span>
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

// --- Form 3: Dark Matter/Quantum ---
const QuantumForm = () => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    return (
        <div className="w-full max-w-md p-8 rounded-2xl bg-black border border-purple-800/50 shadow-2xl shadow-purple-600/20 relative">
             <div className="absolute inset-0 [mask-image:radial-gradient(200px_at_center,white,transparent)]">
                <svg className="absolute inset-0 w-full h-full text-purple-700/50" >
                    <defs>
                        <pattern id="quantum_pattern" width="80" height="80" patternUnits="userSpaceOnUse" patternTransform="scale(0.2) rotate(0)">
                             <path d="M-20 40 l40 40 M20 0 l40 40 M60 0 l-40 40" stroke="currentColor" strokeWidth="2" shapeRendering="geometricPrecision"></path>
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#quantum_pattern)"></rect>
                    <animate attributeName="opacity" values="1;0.3;1" dur="10s" repeatCount="indefinite"></animate>
                </svg>
            </div>
            <div className="relative z-10 text-center mb-8">
                <h2 className="text-4xl font-bold text-white tracking-tighter">QUANTUM</h2>
                <p className="text-purple-400 text-sm">Portal de Autenticación</p>
            </div>
            <form className="space-y-6 relative z-10">
                <div className="relative group">
                    <Input id="email-3" type="email" required className="peer bg-transparent border-b-2 border-purple-600/50 text-white rounded-none focus:border-purple-400 transition-colors h-12 pt-4 placeholder-transparent"/>
                    <Label htmlFor="email-3" className="absolute left-0 top-1/2 -translate-y-1/2 text-purple-400/70 peer-focus:top-2 peer-focus:text-xs peer-focus:text-purple-300 peer-valid:top-2 peer-valid:text-xs transition-all">Entidad Cuántica (Email)</Label>
                </div>
                <div className="relative group">
                    <Input id="password-3" type={isPasswordVisible ? "text" : "password"} required className="peer bg-transparent border-b-2 border-purple-600/50 text-white rounded-none focus:border-purple-400 transition-colors h-12 pt-4 placeholder-transparent pr-10"/>
                    <Label htmlFor="password-3" className="absolute left-0 top-1/2 -translate-y-1/2 text-purple-400/70 peer-focus:top-2 peer-focus:text-xs peer-focus:text-purple-300 peer-valid:top-2 peer-valid:text-xs transition-all">Vector de Estado (Contraseña)</Label>
                    <button type="button" onClick={() => setIsPasswordVisible(!isPasswordVisible)} className="absolute right-0 top-1/2 -translate-y-1/2 text-purple-400/50 hover:text-purple-300">
                        {isPasswordVisible ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                    </button>
                </div>
                <Button variant="ghost" className="w-full text-lg text-purple-300 border-2 border-purple-500/50 rounded-lg hover:bg-purple-600/30 hover:text-white hover:border-purple-400 transition-colors">
                    ENTRELACAR
                </Button>
            </form>
        </div>
    );
};

// --- Form 4: Deconstructed/Glitch ---
const GlitchForm = () => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    return (
        <div className="font-mono bg-black text-green-400 p-6 max-w-md w-full border-2 border-green-500/50 relative">
             <div className="absolute inset-0 bg-black opacity-70 z-0"></div>
             <div className="absolute inset-0" style={{ backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><g fill="%2300ff00" fill-opacity="0.1"><rect x="0" y="0" width="10" height="100"/><rect x="20" y="0" width="10" height="100"/><rect x="40" y="0" width="10" height="100"/><rect x="60" y="0" width="10" height="100"/><rect x="80" y="0" width="10" height="100"/></g></svg>')`, animation: 'glitch-bg 0.5s infinite' }}></div>
            <style>{`
                .glitch-text::after {
                    content: 'root@kernel:~#';
                    position: absolute;
                    left: 2px;
                    top: -2px;
                    color: #ff00ff;
                    clip-path: inset(50% 0 50% 0);
                    animation: glitch-anim 2s infinite linear alternate-reverse;
                }
                 .glitch-text::before {
                    content: 'root@kernel:~#';
                    position: absolute;
                    left: -2px;
                    top: 2px;
                    color: #00ffff;
                    clip-path: inset(50% 0 50% 0);
                    animation: glitch-anim 2.5s infinite linear alternate-reverse;
                }
                @keyframes glitch-anim {
                    0% { clip-path: inset(5% 0 80% 0); }
                    100% { clip-path: inset(80% 0 5% 0); }
                }
                 @keyframes glitch-bg {
                    0%, 100% { transform: translateX(0); }
                    50% { transform: translateX(5px); }
                }
                .input-glitch:focus {
                    animation: glitch-border 0.2s infinite steps(2, jump-both);
                    border-color: #00ff00;
                }
                 @keyframes glitch-border {
                    0% { border-left-color: #ff00ff; border-right-color: #00ffff; }
                    100% { border-left-color: #00ffff; border-right-color: #ff00ff; }
                }
            `}</style>
            <div className="relative z-10">
                <h3 className="text-2xl mb-4 relative glitch-text">root@kernel:~#</h3>
                <form className="space-y-4">
                    <div>
                        <Label htmlFor="email-4">&gt; UID:</Label>
                        <Input id="email-4" type="email" className="input-glitch bg-black/80 border-green-500/50 mt-1 text-green-400 font-mono w-full"/>
                    </div>
                    <div>
                        <Label htmlFor="password-4">&gt; AUTH_KEY:</Label>
                         <div className="relative mt-1">
                            <Input id="password-4" type={isPasswordVisible ? "text" : "password"} className="input-glitch bg-black/80 border-green-500/50 text-green-400 font-mono w-full pr-10"/>
                            <button type="button" onClick={() => setIsPasswordVisible(!isPasswordVisible)} className="absolute right-3 top-1/2 -translate-y-1/2 text-green-400">
                                {isPasswordVisible ? <EyeOff /> : <Eye />}
                            </button>
                        </div>
                    </div>
                    <Button type="submit" variant="outline" className="w-full bg-green-500/20 border-green-500 text-green-400 hover:bg-green-500 hover:text-black">
                        ./LOGIN.SH <span className="ml-2 animate-ping">_</span>
                    </Button>
                </form>
            </div>
        </div>
    );
};

// --- Form 5: Sleek & Corporate ---
const CorporateForm = () => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    return (
        <div className="w-full max-w-sm rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden">
            <div className="p-8">
                 <div className="flex items-center gap-2 mb-6">
                    <Shield className="size-7 text-primary" />
                    <h2 className="text-xl font-semibold">Acceso Seguro</h2>
                </div>
                <form className="space-y-5">
                    <div className="relative">
                        <Input id="email-5" type="email" placeholder=" " className="peer block w-full h-12 rounded-md border-zinc-300 dark:border-zinc-700 bg-zinc-100/50 dark:bg-zinc-800/50 px-4 pt-4 text-sm focus:ring-1 focus:ring-primary"/>
                        <Label htmlFor="email-5" className="absolute left-4 top-3.5 text-muted-foreground text-sm transition-all duration-300 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-primary peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-xs">Correo Corporativo</Label>
                    </div>
                     <div className="relative">
                        <Input id="password-5" type={isPasswordVisible ? "text" : "password"} placeholder=" " className="peer block w-full h-12 rounded-md border-zinc-300 dark:border-zinc-700 bg-zinc-100/50 dark:bg-zinc-800/50 px-4 pt-4 text-sm pr-10 focus:ring-1 focus:ring-primary"/>
                        <Label htmlFor="password-5" className="absolute left-4 top-3.5 text-muted-foreground text-sm transition-all duration-300 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-primary peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-xs">Contraseña</Label>
                        <button type="button" onClick={() => setIsPasswordVisible(!isPasswordVisible)} className="absolute right-3 top-3.5 text-muted-foreground hover:text-foreground">
                            {isPasswordVisible ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                        </button>
                    </div>
                     <Button className="w-full h-12 text-base font-bold bg-zinc-900 dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200">
                        Acceder
                    </Button>
                </form>
            </div>
             <div className="h-2.5 w-full bg-zinc-100 dark:bg-zinc-900 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-accent animate-[scanner_4s_ease-in-out_infinite]"></div>
            </div>
        </div>
    )
}

// --- Form 6: Bio-Organic ---
const BioOrganicForm = () => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    return (
        <Card className="w-full max-w-md bg-transparent border-2 border-green-300/20 rounded-3xl shadow-2xl shadow-green-500/10 backdrop-blur-sm">
            <CardHeader className="text-center">
                 <div className="inline-block p-4 mx-auto border-2 border-green-300/30 rounded-full bg-green-500/10 mb-4">
                     <Fingerprint className="size-10 text-green-300" />
                 </div>
                <CardTitle className="text-2xl font-light text-green-200 tracking-wider">AUTENTICACIÓN BIOMÉTRICA</CardTitle>
                <CardDescription className="text-green-400/60">Sincroniza tu identidad con el núcleo.</CardDescription>
            </CardHeader>
            <CardContent>
                <form className="space-y-6">
                    <div className="relative">
                        <motion.div
                            className="absolute inset-0 border-b-2 border-green-400"
                            initial={{ scaleX: 0 }}
                            whileFocus={{ scaleX: 1 }}
                            transition={{ duration: 0.5, ease: 'circOut' }}
                            style={{ transformOrigin: 'left' }}
                        />
                        <Input
                            id="email-6" type="email" placeholder="Identificador Genético (email)"
                            className="bg-transparent border-0 border-b-2 border-green-400/30 rounded-none text-white h-12 text-center text-sm tracking-widest placeholder:text-green-400/40 focus:ring-0 focus:border-b-2 focus:border-green-400"
                        />
                    </div>
                    <div className="relative">
                        <Input
                            id="password-6" type={isPasswordVisible ? 'text' : 'password'} placeholder="Secuencia de Acceso"
                            className="bg-transparent border-0 border-b-2 border-green-400/30 rounded-none text-white h-12 text-center text-sm tracking-widest placeholder:text-green-400/40 focus:ring-0 focus:border-b-2 focus:border-green-400"
                        />
                         <button type="button" onClick={() => setIsPasswordVisible(!isPasswordVisible)} className="absolute right-0 top-1/2 -translate-y-1/2 text-green-400/50 hover:text-green-300">
                            {isPasswordVisible ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                        </button>
                    </div>
                     <Button variant="ghost" className="w-full border-2 border-green-400/50 text-green-300 hover:bg-green-400/20 hover:text-white hover:border-green-400 rounded-xl h-12 text-base tracking-wider">
                        SINCRONIZAR
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};


export default function DemoPage() {
  return (
    <div className="min-h-screen w-full bg-zinc-900 text-white flex flex-col items-center justify-center p-4 sm:p-8 space-y-16">
        <h1 className="text-5xl font-bold text-center tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-400">
            Propuestas de Formularios de Inicio de Sesión
        </h1>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-16">
            <div className="flex justify-center items-center">
                <HolographicForm />
            </div>
            <div className="flex justify-center items-center">
                <AICoreForm />
            </div>
            <div className="flex justify-center items-center">
                <QuantumForm />
            </div>
            <div className="flex justify-center items-center">
                <GlitchForm />
            </div>
            <div className="flex justify-center items-center">
                <CorporateForm />
            </div>
            <div className="flex justify-center items-center">
                <BioOrganicForm />
            </div>
        </div>
    </div>
  );
}

    
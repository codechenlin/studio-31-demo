
"use client";

import React, { useState, useEffect, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Shield, PlusCircle, Trash2, Edit, Check, X, Loader2, DollarSign, Server, LayoutTemplate, Mail, FolderOpen, Tag } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { getPlans, savePlan, deletePlan, type SubscriptionPlan } from './actions';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
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
} from '@/components/ui/alert-dialog'
import { Skeleton } from '@/components/ui/skeleton';

function PlanForm({ plan, onSave, onCancel }: { plan: Partial<SubscriptionPlan> | null, onSave: (plan: SubscriptionPlan) => void, onCancel: () => void }) {
    const [name, setName] = useState(plan?.name || '');
    const [prices, setPrices] = useState(plan?.prices || { usd: 0, mxn: 0, cad: 0 });
    const [features, setFeatures] = useState(plan?.features || {
        smtpDomains: { enabled: false, limit: 0 },
        templateBuilder: { enabled: false },
        emailsPerDomain: { limit: 0 },
    });
    
    const handleSubmit = () => {
        const newPlan: SubscriptionPlan = {
            id: plan?.id || `plan_${Date.now()}`,
            name,
            prices,
            features
        };
        onSave(newPlan);
    }
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
            <div className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="plan-name">Nombre del Plan</Label>
                    <Input id="plan-name" value={name} onChange={e => setName(e.target.value)} placeholder="Ej: Plan Básico"/>
                </div>
                <div className="space-y-4">
                    <Label>Precios</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div className="relative"><DollarSign className="absolute left-2.5 top-2.5 size-4 text-muted-foreground"/><Input type="number" value={prices.usd} onChange={e => setPrices({...prices, usd: parseFloat(e.target.value) || 0})} placeholder="USD" className="pl-8"/></div>
                        <div className="relative"><Tag className="absolute left-2.5 top-2.5 size-4 text-muted-foreground"/><Input type="number" value={prices.mxn} onChange={e => setPrices({...prices, mxn: parseFloat(e.target.value) || 0})} placeholder="MXN" className="pl-8"/></div>
                        <div className="relative"><Tag className="absolute left-2.5 top-2.5 size-4 text-muted-foreground"/><Input type="number" value={prices.cad} onChange={e => setPrices({...prices, cad: parseFloat(e.target.value) || 0})} placeholder="CAD" className="pl-8"/></div>
                    </div>
                </div>
            </div>
            <div className="space-y-6">
                <Card>
                    <CardHeader><CardTitle className="text-base flex items-center gap-2"><Server/> Dominios SMTP Genéricos</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                         <div className="flex items-center justify-between"><Label>Habilitar</Label><Switch checked={features.smtpDomains.enabled} onCheckedChange={c => setFeatures({...features, smtpDomains: {...features.smtpDomains, enabled: c}})} /></div>
                         <div className="flex items-center justify-between"><Label>Límite de Dominios</Label><Input type="number" className="w-20" value={features.smtpDomains.limit} onChange={e => setFeatures({...features, smtpDomains: {...features.smtpDomains, limit: parseInt(e.target.value) || 0}})} disabled={!features.smtpDomains.enabled} /></div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle className="text-base flex items-center gap-2"><LayoutTemplate/> Constructor de Plantillas</CardTitle></CardHeader>
                    <CardContent className="flex items-center justify-between">
                        <Label>Habilitar</Label>
                        <Switch checked={features.templateBuilder.enabled} onCheckedChange={c => setFeatures({...features, templateBuilder: {...features.templateBuilder, enabled: c}})} />
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader><CardTitle className="text-base flex items-center gap-2"><Mail/> Correos por Dominio</CardTitle></CardHeader>
                    <CardContent className="flex items-center justify-between">
                       <Label>Límite de Correos</Label>
                       <Input type="number" className="w-20" value={features.emailsPerDomain.limit} onChange={e => setFeatures({...features, emailsPerDomain: {...features.emailsPerDomain, limit: parseInt(e.target.value) || 0}})} disabled={!features.smtpDomains.enabled} />
                    </CardContent>
                </Card>
            </div>
            <DialogFooter className="md:col-span-2">
                <Button variant="outline" onClick={onCancel}>Cancelar</Button>
                <Button onClick={handleSubmit}>Guardar Plan</Button>
            </DialogFooter>
        </div>
    );
}

export default function SubscriptionPlansPage() {
    const { toast } = useToast();
    const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
    const [isLoading, startLoading] = useTransition();
    const [isSaving, startSavingAction] = useTransition();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
    const [deletingPlan, setDeletingPlan] = useState<SubscriptionPlan | null>(null);

    const fetchPlans = React.useCallback(() => {
        startLoading(async () => {
            const result = await getPlans();
            if(result.success && result.data) {
                setPlans(result.data);
            } else {
                toast({ title: "Error al cargar planes", description: result.error, variant: 'destructive' });
            }
        });
    }, [toast]);
    
    useEffect(() => {
        fetchPlans();
    }, [fetchPlans]);

    const handleSavePlan = (plan: SubscriptionPlan) => {
        startSavingAction(async () => {
            const result = await savePlan(plan);
            if(result.success) {
                toast({ title: "¡Éxito!", description: `Plan "${plan.name}" guardado.`, className: 'bg-green-500 text-white' });
                fetchPlans();
                setIsModalOpen(false);
                setEditingPlan(null);
            } else {
                toast({ title: "Error al guardar", description: result.error, variant: 'destructive' });
            }
        });
    };
    
    const handleDeletePlan = () => {
        if(!deletingPlan) return;
        startSavingAction(async () => {
            const result = await deletePlan(deletingPlan.id);
             if(result.success) {
                toast({ title: "Plan Eliminado", description: `El plan "${deletingPlan.name}" fue eliminado.` });
                fetchPlans();
                setDeletingPlan(null);
            } else {
                toast({ title: "Error al eliminar", description: result.error, variant: 'destructive' });
            }
        });
    };

    return (
        <>
            <div className="space-y-8">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2"><Shield/> Planes de Suscripción</h1>
                        <p className="text-muted-foreground">Crea y gestiona los planes para los usuarios de tu plataforma.</p>
                    </div>
                    <Button onClick={() => { setEditingPlan(null); setIsModalOpen(true); }}><PlusCircle className="mr-2"/>Crear Nuevo Plan</Button>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({length:3}).map((_,i) => <Skeleton key={i} className="h-96"/>)}
                    </div>
                ) : plans.length === 0 ? (
                    <div className="text-center py-20 text-muted-foreground flex flex-col items-center justify-center border-2 border-dashed border-border/60 rounded-lg h-96">
                        <FolderOpen className="size-16 mb-4 text-primary/50" />
                        <h3 className="text-xl font-semibold text-foreground">No se encontraron planes</h3>
                        <p className="mt-2">Crea tu primer plan de suscripción para empezar a monetizar.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {plans.map(plan => (
                            <Card key={plan.id} className="flex flex-col">
                                <CardHeader>
                                    <CardTitle>{plan.name}</CardTitle>
                                    <CardDescription>
                                        {plan.prices.usd > 0 ? `$${plan.prices.usd} USD` : 'Gratis'} / Mes
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex-grow space-y-4">
                                    <div className="text-sm space-y-2">
                                        <div className="flex items-center gap-2"><Check className={cn("size-4", plan.features.smtpDomains.enabled ? "text-green-500" : "text-muted-foreground/50")}/> {plan.features.smtpDomains.enabled ? `Hasta ${plan.features.smtpDomains.limit} dominios SMTP` : 'Sin dominios SMTP'}</div>
                                        <div className="flex items-center gap-2"><Check className={cn("size-4", plan.features.templateBuilder.enabled ? "text-green-500" : "text-muted-foreground/50")}/> {plan.features.templateBuilder.enabled ? 'Constructor de Plantillas' : 'Sin constructor'}</div>
                                        <div className="flex items-center gap-2"><Check className={cn("size-4", plan.features.smtpDomains.enabled ? "text-green-500" : "text-muted-foreground/50")}/> {plan.features.smtpDomains.enabled ? `Hasta ${plan.features.emailsPerDomain.limit} correos por dominio` : 'Sin correos personalizados'}</div>
                                    </div>
                                </CardContent>
                                <CardFooter className="gap-2">
                                    <Button variant="outline" className="w-full" onClick={() => { setEditingPlan(plan); setIsModalOpen(true); }}><Edit className="mr-2"/>Editar</Button>
                                    <Button variant="destructive" className="w-full" onClick={() => setDeletingPlan(plan)}><Trash2 className="mr-2"/>Eliminar</Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
            
            {/* Modal for Create/Edit */}
            <Dialog open={isModalOpen} onOpenChange={open => !open && setIsModalOpen(false)}>
                <DialogContent className="max-w-4xl">
                     <DialogHeader>
                        <DialogTitle>{editingPlan ? 'Editar Plan' : 'Crear Nuevo Plan'}</DialogTitle>
                        <DialogDescription>
                            Define los detalles, precios y características de este plan.
                        </DialogDescription>
                    </DialogHeader>
                    <PlanForm 
                        plan={editingPlan}
                        onSave={handleSavePlan}
                        onCancel={() => { setIsModalOpen(false); setEditingPlan(null); }}
                    />
                </DialogContent>
            </Dialog>

             {/* Alert for Delete */}
             <AlertDialog open={!!deletingPlan} onOpenChange={(open) => !open && setDeletingPlan(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Confirmar eliminación?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. El plan "{deletingPlan?.name}" será eliminado permanentemente.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeletePlan} disabled={isSaving}>
                            {isSaving ? <Loader2 className="animate-spin" /> : 'Sí, eliminar'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

    
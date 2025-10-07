
'use server';

import fs from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const plansFilePath = path.join(process.cwd(), 'src', 'app', 'lib', 'subscription-plans.json');

const pricesSchema = z.object({
    usd: z.number(),
    mxn: z.number(),
    cad: z.number(),
});

const featuresSchema = z.object({
    smtpDomains: z.object({
        enabled: z.boolean(),
        limit: z.number(),
    }),
    templateBuilder: z.object({
        enabled: z.boolean(),
    }),
    emailsPerDomain: z.object({
        limit: z.number(),
    }),
});

const planSchema = z.object({
    id: z.string(),
    name: z.string().min(1, "El nombre del plan es requerido."),
    prices: pricesSchema,
    features: featuresSchema,
});

export type SubscriptionPlan = z.infer<typeof planSchema>;

async function readPlansFile(): Promise<SubscriptionPlan[]> {
  try {
    const fileContent = await fs.readFile(plansFilePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      // File doesn't exist, return empty array
      return [];
    }
    console.error("Failed to read subscription-plans.json:", error);
    throw new Error('No se pudo leer el archivo de planes.');
  }
}

async function writePlansFile(plans: SubscriptionPlan[]) {
  try {
    await fs.writeFile(plansFilePath, JSON.stringify(plans, null, 2));
  } catch (error) {
    console.error("Failed to write to subscription-plans.json:", error);
    throw new Error('No se pudo guardar el archivo de planes.');
  }
}

export async function getPlans(): Promise<{ success: boolean; data?: SubscriptionPlan[]; error?: string }> {
    try {
        const plans = await readPlansFile();
        return { success: true, data: plans };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function savePlan(planData: SubscriptionPlan): Promise<{ success: boolean; error?: string }> {
  const validation = planSchema.safeParse(planData);
  if (!validation.success) {
    return { success: false, error: validation.error.errors.map(e => e.message).join(', ') };
  }

  try {
    const plans = await readPlansFile();
    const existingPlanIndex = plans.findIndex(p => p.id === planData.id);

    if (existingPlanIndex > -1) {
      // Update existing plan
      plans[existingPlanIndex] = planData;
    } else {
      // Add new plan
      plans.push(planData);
    }

    await writePlansFile(plans);
    revalidatePath('/d92y02b11u/dashboard/subscription-plans');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deletePlan(planId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const plans = await readPlansFile();
    const updatedPlans = plans.filter(p => p.id !== planId);

    if (plans.length === updatedPlans.length) {
      return { success: false, error: "Plan no encontrado." };
    }

    await writePlansFile(updatedPlans);
    revalidatePath('/d92y02b11u/dashboard/subscription-plans');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

    
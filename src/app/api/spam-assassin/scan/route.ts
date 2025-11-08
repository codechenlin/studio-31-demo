
import { NextResponse } from 'next/server';
import { SpamAssassinInputSchema, type SpamAssassinInput } from '@/ai/flows/spam-assassin-types';

export async function POST(request: Request) {
  const API_BASE = "https://gdvsjd6vdkw749874bkd83.fanton.cloud";
  const API_KEY = "gydsbf68bf70b74004673nd73";

  try {
    const body: SpamAssassinInput = await request.json();
    const validatedInput = SpamAssassinInputSchema.parse(body);
    
    const url = `${API_BASE}/scan-json`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify(validatedInput),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`SpamAssassin API Error: ${response.status}`, errorBody);
      return NextResponse.json({ error: `Error con la API de SpamAssassin: ${response.statusText}. Cuerpo: ${errorBody}` }, { status: response.status });
    }

    const result = await response.json();
    return NextResponse.json(result);

  } catch (error: any) {
    console.error('SpamAssassin API call failed:', error);
    if (error.name === 'ZodError') {
        return NextResponse.json({ error: 'Datos de entrada inválidos.', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: `No se pudo conectar con la API de SpamAssassin: ${error.message}` }, { status: 500 });
  }
}

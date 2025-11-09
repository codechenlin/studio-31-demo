import { NextResponse } from 'next/server';

const API_BASE = "https://gdvsjd6vdkw749874bkd83.fanton.cloud:8180";
const API_KEY = "75bf75bnrfnuif0857nbf74fe521zdx";

export async function GET() {
  const url = `${API_BASE}/health`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-Api-Key': API_KEY,
      }
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`SpamAssassin Health API Error: ${response.status}`, errorBody);
      return NextResponse.json({ error: `Error con la API de SpamAssassin: ${response.statusText}. Cuerpo: ${errorBody}` }, { status: response.status });
    }

    const result = await response.json();
    return NextResponse.json(result);

  } catch (error: any) {
    console.error('SpamAssassin Health API call failed:', error);
    return NextResponse.json({ error: `No se pudo conectar con la API de SpamAssassin: ${error.message}` }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const url = `${API_BASE}/classify/json`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': API_KEY,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`SpamAssassin Classify API Error: ${response.status}`, errorBody);
      return NextResponse.json({ error: `Error con la API de SpamAssassin: ${response.statusText}. Cuerpo: ${errorBody}` }, { status: response.status });
    }

    const result = await response.json();
    return NextResponse.json(result);

  } catch (error: any) {
    console.error('SpamAssassin Classify API call failed:', error);
    if (error.name === 'ZodError') {
        return NextResponse.json({ error: 'Datos de entrada inválidos.', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: `No se pudo conectar con la API de SpamAssassin: ${error.message}` }, { status: 500 });
  }
}

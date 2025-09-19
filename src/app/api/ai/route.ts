export const runtime = 'edge';

import { NextRequest } from 'next/server';

export async function GET() {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return new Response(JSON.stringify({ ok: false, hasKey: false }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ ok: true, hasKey: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'OPENAI_API_KEY missing' }), {
      status: 500,
    });
  }

  const { mode, pool, mistakes, augmentCount } = await req.json();

  let messages;

  if (mode === 'augment') {
    messages = [
      {
        role: 'user',
        content:
          `Genera ${augmentCount ?? 10} preguntas MCQ en JSON PURO (array).\n` +
          `Esquema por item: { "id": string, "type": "radio"|"checkbox", "prompt": string, ` +
          `"options": [{"id": string, "text": string}, ...], "answer": [string], "explanation"?: string }.\n` +
          `No repitas IDs, cuida rigor técnico y claridad.\n` +
          `Pool base:\n` +
          JSON.stringify(pool).slice(0, 30000),
      },
    ];
  } else if (mode === 'explain') {
    // mistakes viene desde el cliente -> array con { id, chosen, correct }
    messages = [
      {
        role: 'user',
        content:
          `Eres tutor. Explica SOLO las preguntas que el alumno respondió incorrectamente.\n` +
          `Devuelve JSON con shape: { "explanations": { [questionId: string]: string } }.\n` +
          `Haz la explicación breve, clara y enfocada en por qué la respuesta correcta lo es.\n` +
          `Preguntas del bloque:\n${JSON.stringify(pool).slice(0, 30000)}\n` +
          `Errores del alumno:\n${JSON.stringify(mistakes).slice(0, 30000)}`,
      },
    ];
  } else if (mode === 'explain-json') {
    messages = [
      {
        role: 'user',
        content:
          `Eres tutor experto. Para cada pregunta del siguiente pool JSON, añade una explicación breve ` +
          `de por qué las respuestas correctas lo son.\n` +
          `Devuelve el mismo pool con las "explanation" rellenadas.\n` +
          `Pool:\n${JSON.stringify(pool).slice(0, 30000)}`,
      },
    ];
  }

  const body = {
    model: process.env.OPENAI_MODEL ?? 'gpt-4.1-mini',
    temperature: 0.2,
    messages,
  } as const;

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    return new Response(JSON.stringify({ error: text }), { status: 500 });
  }

  const data = await res.json();
  const content: string = data?.choices?.[0]?.message?.content ?? '';

  // Tolerante: intenta parsear objeto o array; si falla, devuelve raw
  try {
    const start = Math.min(
      ...[content.indexOf('['), content.indexOf('{')].filter((n) => n >= 0)
    );
    if (start >= 0) {
      const parsed = JSON.parse(content.slice(start));
      return new Response(JSON.stringify(parsed), { status: 200 });
    }
  } catch {}

  return new Response(JSON.stringify({ raw: content }), { status: 200 });
}

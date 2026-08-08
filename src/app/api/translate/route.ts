import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const text = searchParams.get('text') || searchParams.get('q');
  const targetLang = searchParams.get('targetLang') || searchParams.get('tl') || 'ko';

  if (!text || text.trim() === '') {
    return NextResponse.json({ translatedText: text || '' });
  }

  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });

    if (res.ok) {
      const data = await res.json();
      if (data && data[0] && Array.isArray(data[0])) {
        const translated = data[0].map((item: any) => item[0]).join('');
        if (translated && translated.trim() !== '') {
          return NextResponse.json({ translatedText: translated });
        }
      }
    }
  } catch (err) {
    console.error('Server translate endpoint error:', err);
  }

  return NextResponse.json({ translatedText: text });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text, targetLang = 'ko' } = body;

    if (!text || text.trim() === '') {
      return NextResponse.json({ translatedText: text || '' });
    }

    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });

    if (res.ok) {
      const data = await res.json();
      if (data && data[0] && Array.isArray(data[0])) {
        const translated = data[0].map((item: any) => item[0]).join('');
        if (translated && translated.trim() !== '') {
          return NextResponse.json({ translatedText: translated });
        }
      }
    }
    return NextResponse.json({ translatedText: text });
  } catch (err) {
    console.error('Server translate POST error:', err);
    return NextResponse.json({ translatedText: '' }, { status: 500 });
  }
}

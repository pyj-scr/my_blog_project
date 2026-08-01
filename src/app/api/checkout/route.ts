import { NextResponse } from 'next/server';

const getCleanStripeKey = (): string => {
  let key = process.env.STRIPE_SECRET_KEY || '';
  if (!key) {
    const encoded = 'c2tfdGVzdF81MVR6WElzQ1J0NXVFMHZPYXFEdlI2cThBWEJuRUplTVlJRESSR2J0RW9wekQwNk9Cemgzdlo5TXJRV2dSMWlreUREbkJjMjBwUk9SZ3BqVEdYWXhwRnRlWEEwMGY5U2h4b0Vw';
    try {
      key = Buffer.from(encoded, 'base64').toString('ascii');
    } catch {
      key = '';
    }
  }
  // Sanitize key to ensure strictly printable ASCII (prevent ByteString > 255 error)
  return key.replace(/[^\x20-\x7E]/g, '').trim();
};

export async function POST(req: Request) {
  try {
    const stripeSecretKey = getCleanStripeKey();
    if (!stripeSecretKey) {
      return NextResponse.json({ error: 'Stripe Secret Key is missing' }, { status: 400 });
    }

    const { appId, title, price, currency } = await req.json();
    const origin = req.headers.get('origin') || 'https://100yen.yoyogiyj.com';

    let unitAmount = '100'; // Default 100 JPY
    let curr = 'jpy';

    if (currency === 'KRW' || currency === 'ko') {
      unitAmount = '1000';
      curr = 'krw';
    } else if (currency === 'USD' || currency === 'en') {
      unitAmount = '100'; // $1.00 USD (in cents)
      curr = 'usd';
    } else {
      unitAmount = '100'; // 100 JPY
      curr = 'jpy';
    }

    // Direct REST API Payload for Stripe Checkout Sessions
    const params = new URLSearchParams();
    params.append('payment_method_types[0]', 'card');
    params.append('line_items[0][price_data][currency]', curr);
    params.append('line_items[0][price_data][product_data][name]', `${title} (100円 App Shop License)`);
    params.append('line_items[0][price_data][product_data][description]', `100엔 마켓 - ${title} 평생 이용 권한`);
    params.append('line_items[0][price_data][unit_amount]', unitAmount);
    params.append('line_items[0][quantity]', '1');
    params.append('mode', 'payment');
    params.append('success_url', `${origin}/mypage?success=true&appId=${appId}`);
    params.append('cancel_url', `${origin}/?canceled=true`);

    const stripeRes = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const data = await stripeRes.json();

    if (!stripeRes.ok) {
      console.error('Stripe Direct API Error:', data);
      return NextResponse.json(
        { error: data.error?.message || 'Stripe API Session Error' },
        { status: stripeRes.status }
      );
    }

    return NextResponse.json({ url: data.url });
  } catch (err: any) {
    console.error('Checkout Handler Error:', err);
    return NextResponse.json(
      { error: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

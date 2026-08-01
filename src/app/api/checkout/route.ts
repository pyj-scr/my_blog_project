import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';

export async function POST(req: Request) {
  try {
    if (!stripeSecretKey) {
      throw new Error('Stripe API Key is missing');
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2025-01-27.acacia' as any,
    });

    const { appId, title, price, currency } = await req.json();
    const origin = req.headers.get('origin') || 'https://100yen.yoyogiyj.com';

    let unitAmount = 100; // Default 100 JPY
    let curr = 'jpy';

    if (currency === 'KRW' || currency === 'ko') {
      unitAmount = 1000;
      curr = 'krw';
    } else if (currency === 'USD' || currency === 'en') {
      unitAmount = 100; // $1.00 USD (in cents)
      curr = 'usd';
    } else {
      unitAmount = 100; // 100 JPY
      curr = 'jpy';
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: curr,
            product_data: {
              name: `${title} (어플 100엔 샾 정품 영구 라이선스)`,
              description: `100엔 마켓 - ${title} 평생 이용 권한`,
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/mypage?success=true&appId=${appId}`,
      cancel_url: `${origin}/?canceled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('Stripe Checkout Error:', err);
    return NextResponse.json(
      { error: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

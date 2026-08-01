import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const getStripeKey = () => {
  if (process.env.STRIPE_SECRET_KEY) return process.env.STRIPE_SECRET_KEY;
  const encoded = 'c2tfdGVzdF81MVR6WElzQ1J0NXVFMHZPYXFEdlI2cThBWEJuRUplTVlJRESSR2J0RW9wekQwNk9Cemgzdlo5TXJRV2dSMWlreUREbkJjMjBwUk9SZ3BqVEdYWXhwRnRlWEEwMGY5U2h4b0Vw';
  try {
    return Buffer.from(encoded, 'base64').toString('utf-8');
  } catch {
    return '';
  }
};

export async function POST(req: Request) {
  try {
    const stripeSecretKey = getStripeKey();

    // Initialize Stripe without restrictive API version constraints for maximum compatibility
    const stripe = new Stripe(stripeSecretKey, {
      httpClient: Stripe.createFetchHttpClient(),
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
              name: `${title} (100円 App Shop License)`,
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
      { error: err.message || 'Stripe API Connection Error' },
      { status: 500 }
    );
  }
}

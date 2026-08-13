export function getCleanStripeKey(): string {
  const key = process.env.STRIPE_SECRET_KEY || '';
  return key.replace(/[^\x20-\x7E]/g, '').trim();
}

export interface StripeCheckoutSession {
  id: string;
  payment_status: string;
  metadata?: Record<string, string>;
  customer_details?: { email?: string | null } | null;
}

export async function fetchStripeCheckoutSession(sessionId: string): Promise<StripeCheckoutSession | null> {
  const key = getCleanStripeKey();
  if (!key || !sessionId) return null;

  try {
    const res = await fetch(`https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`, {
      headers: { Authorization: `Bearer ${key}` },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error('Stripe session fetch error:', err);
    return null;
  }
}

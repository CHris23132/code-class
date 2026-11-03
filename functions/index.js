import { onCall, onRequest, HttpsError } from 'firebase-functions/v2/https';
import { defineSecret, defineString } from 'firebase-functions/params';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import Stripe from 'stripe';
import { META_CAPI_SECRET, sendKitPurchase } from './meta-purchase.js';

initializeApp();

const stripeSecret = defineSecret('STRIPE_SECRET_KEY');
const webhookSecret = defineSecret('STRIPE_WEBHOOK_SECRET');
const metaCapiToken = defineSecret(META_CAPI_SECRET);
const priceCents = defineString('CLASS_PRICE_CENTS');
const siteOrigin = defineString('CLASS_SITE_ORIGIN', { default: 'https://torontoinnovationlab.com' });

const region = 'us-central1';

function stripeClient() {
  return new Stripe(stripeSecret.value());
}

function classPriceCents() {
  const cents = Number(priceCents.value());
  if (!Number.isInteger(cents) || cents < 50) {
    throw new HttpsError('failed-precondition', 'Class price is not configured.');
  }
  return cents;
}

export const createClassCheckout = onCall({ region, secrets: [stripeSecret] }, async (request) => {
  if (!request.auth) throw new HttpsError('unauthenticated', 'Sign in before paying.');
  const uid = request.auth.uid;
  const existing = await getFirestore().collection('students').doc(uid).get();
  if (existing.get('access.paid') === true) {
    throw new HttpsError('already-exists', 'This account already has the class.');
  }
  const origin = siteOrigin.value().replace(/\/$/, '');
  const session = await stripeClient().checkout.sessions.create({
    mode: 'payment',
    customer_email: request.auth.token.email || undefined,
    client_reference_id: uid,
    metadata: { uid, app: 'codeclass' },
    line_items: [{
      quantity: 1,
      price_data: {
        currency: 'usd',
        unit_amount: classPriceCents(),
        product_data: {
          name: 'Code Class',
          description: 'Full access to the Code Class video course and live-class guide.'
        }
      }
    }],
    success_url: `${origin}/future-founder-class.html?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/future-founder-class.html?checkout=cancel`
  });
  return { url: session.url };
});

export const stripeWebhook = onRequest({ region, secrets: [stripeSecret, webhookSecret, metaCapiToken], invoker: 'public' }, async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send('Method not allowed');
    return;
  }
  let event;
  try {
    event = stripeClient().webhooks.constructEvent(req.rawBody, req.get('stripe-signature'), webhookSecret.value());
  } catch {
    res.status(400).send('Invalid Stripe signature');
    return;
  }
  if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
    const session = event.data.object;
    if (session.payment_status === 'paid') {
      const uid = session.metadata?.uid || session.client_reference_id;
      if (uid) {
        await getFirestore().collection('students').doc(uid).set({
          access: {
            source: 'stripe',
            paid: true,
            unlockedAt: new Date().toISOString(),
            checkoutSessionId: session.id,
            paymentIntentId: typeof session.payment_intent === 'string' ? session.payment_intent : null,
            amountTotal: session.amount_total ?? null,
            currency: session.currency || 'usd'
          },
          updatedAt: FieldValue.serverTimestamp()
        }, { merge: true });
      }
      try {
        const purchase = await sendKitPurchase(session, { token: metaCapiToken.value(), origin: siteOrigin.value() });
        if (!purchase.sent) console.error('Meta Purchase CAPI not sent', purchase.reason || purchase.status || '');
      } catch {
        console.error('Meta Purchase CAPI error');
      }
    }
  }
  res.status(200).json({ received: true });
});

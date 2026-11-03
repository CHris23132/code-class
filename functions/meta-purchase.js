import { createHash } from 'node:crypto';

export const META_PURCHASE_PIXEL_ID = '711127870519369';
export const META_CAPI_SECRET = 'META_CAPI_ACCESS_TOKEN';
const GRAPH_VERSION = 'v23.0';
const KIT_PRICE_CENTS = 2700;

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

export function kitPurchasePayload(session, origin) {
  if (session?.metadata?.app !== 'codeclass') return null;
  if (session.payment_status !== 'paid') return null;
  if (!session.id) return null;
  if (session.amount_total != null && session.amount_total !== KIT_PRICE_CENTS) return null;

  const email = String(session.customer_details?.email || session.customer_email || '').trim().toLowerCase();
  const uid = String(session.metadata?.uid || session.client_reference_id || '');
  const userData = {};
  if (email) userData.em = [sha256(email)];
  if (uid) userData.external_id = [sha256(uid)];
  if (!Object.keys(userData).length) return null;

  const site = String(origin || 'https://torontoinnovationlab.com').replace(/\/$/, '');
  return {
    data: [{
      event_name: 'Purchase',
      event_time: Math.floor(Date.now() / 1000),
      event_id: session.id,
      action_source: 'website',
      event_source_url: `${site}/future-founder-class.html?checkout=success&session_id=${session.id}`,
      user_data: userData,
      custom_data: { value: 27, currency: 'USD' }
    }]
  };
}

export async function sendKitPurchase(session, { token, origin, fetchImpl = fetch } = {}) {
  const payload = kitPurchasePayload(session, origin);
  if (!payload) return { sent: false, reason: 'not-a-kit-purchase' };
  if (!token) return { sent: false, reason: 'missing-token' };
  const url = `https://graph.facebook.com/${GRAPH_VERSION}/${META_PURCHASE_PIXEL_ID}/events?access_token=${encodeURIComponent(token)}`;
  const response = await fetchImpl(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return { sent: response.ok, status: response.status };
}

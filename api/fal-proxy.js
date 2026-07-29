// Server-side proxy for fal.ai calls.
// The FAL_KEY env var is set in the Vercel project dashboard (Settings →
// Environment Variables) — it is NEVER sent to the browser. The client calls
// this endpoint instead of calling fal.ai directly.

const ALLOWED_HOSTS = ['queue.fal.run', 'rest.fal.run'];

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const FAL_KEY = process.env.FAL_KEY;
  if (!FAL_KEY) {
    res.status(500).json({ error: 'Server misconfigured: FAL_KEY env var is not set' });
    return;
  }

  const { targetUrl, method, body } = req.body || {};

  let parsed;
  try {
    parsed = new URL(targetUrl);
  } catch {
    res.status(400).json({ error: 'Invalid or missing targetUrl' });
    return;
  }

  // Only ever forward to fal.ai — prevents this proxy being abused as an
  // open relay to arbitrary URLs.
  if (!ALLOWED_HOSTS.includes(parsed.hostname)) {
    res.status(400).json({ error: `Target host not allowed: ${parsed.hostname}` });
    return;
  }

  try {
    const falResp = await fetch(targetUrl, {
      method: method || 'GET',
      headers: {
        'Authorization': `Key ${FAL_KEY}`,
        'Content-Type': 'application/json'
      },
      body: body ? JSON.stringify(body) : undefined
    });

    const text = await falResp.text();
    res.status(falResp.status);
    res.setHeader('Content-Type', falResp.headers.get('content-type') || 'application/json');
    res.send(text);
  } catch (err) {
    res.status(502).json({ error: 'Upstream fal.ai request failed', detail: String(err) });
  }
}

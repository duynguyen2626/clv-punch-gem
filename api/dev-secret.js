// api/dev-secret.js
// ONLY works in local development (vercel dev).
// Returns the PUNCH_SECRET so the frontend can auto-fill it.
// In production this endpoint returns 404 immediately.

export default function handler(req, res) {
    // Block in production
    if (process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production') {
        return res.status(404).json({ ok: false, error: 'Not found' });
    }

    const secret = process.env.PUNCH_SECRET;
    if (!secret) {
        return res.status(404).json({ ok: false, error: 'PUNCH_SECRET not set' });
    }

    return res.status(200).json({ ok: true, secret });
}

const { setTelegramConfig, setPunchTimes } = require('../lib/kv');

const expected = process.env.PUNCH_SECRET || 'Thanhnam0';

function authenticate(req) {
    const hdrSecret = req.headers['x-secret'] || '';
    if (hdrSecret !== expected) throw new Error('invalid secret');
}

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'method not allowed' });

    try {
        authenticate(req);
        const { telegram, times } = req.body;

        const promises = [];
        if (telegram) promises.push(setTelegramConfig(telegram));
        if (times) promises.push(setPunchTimes(times));

        await Promise.all(promises);
        return res.status(200).json({ ok: true });
    } catch (e) {
        return res.status(500).json({ ok: false, error: e.message });
    }
}

// File: api/update-schedule.js
const { setSchedule } = require('../lib/kv');

const expected = process.env.PUNCH_SECRET || 'Thanhnam0';

function authenticate(req) {
    const hdrSecret = req.headers['x-secret'] || '';
    if (hdrSecret !== expected) throw new Error('invalid secret');
}

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'method not allowed' });

    try {
        authenticate(req);
        const { schedule } = req.body;
        if (!schedule) throw new Error('schedule data missing');

        await setSchedule(schedule);
        return res.status(200).json({ ok: true });
    } catch (e) {
        return res.status(500).json({ ok: false, error: e.message });
    }
}

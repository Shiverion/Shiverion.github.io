export default function handler(req, res) {
    // Get IP from Vercel headers (x-forwarded-for is most reliable)
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    // Get location data from Vercel edge headers
    const country = req.headers['x-vercel-ip-country'] || 'Unknown Country';
    const countryCode = req.headers['x-vercel-ip-country'] || 'XX';
    const region = req.headers['x-vercel-ip-region1'] || 'Unknown Region';
    const city = req.headers['x-vercel-ip-city'] || 'Unknown City';
    const latitude = req.headers['x-vercel-ip-latitude'] || '0';
    const longitude = req.headers['x-vercel-ip-longitude'] || '0';
    const timezone = req.headers['x-vercel-ip-timezone'] || 'UTC';

    // Mock data for local development (when headers are missing)
    if (!req.headers['x-vercel-ip-city']) {
        return res.status(200).json({
            ip: '127.0.0.1',
            city: 'Jakarta',
            region: 'DKI Jakarta',
            country: 'Indonesia',
            countryCode: 'ID',
            latitude: '-6.2088',
            longitude: '106.8456',
            timezone: 'Asia/Jakarta'
        });
    }

    res.status(200).json({
        ip: ip.split(',')[0], // Take the first IP if there are multiple
        city: decodeURIComponent(city),
        region: decodeURIComponent(region),
        country,
        countryCode,
        latitude,
        longitude,
        timezone
    });
}

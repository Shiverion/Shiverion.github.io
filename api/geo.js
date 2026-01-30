export default function handler(req, res) {
    // Get IP from Vercel headers (x-forwarded-for is most reliable)
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    // Get location data from Vercel edge headers
    const city = req.headers['x-vercel-ip-city'] || 'Unknown City';
    const region = req.headers['x-vercel-ip-region1'] || 'Unknown Region';
    const country = req.headers['x-vercel-ip-country'] || 'Unknown Country';
    const countryCode = req.headers['x-vercel-ip-country-region'] || 'XX';
    const latitude = req.headers['x-vercel-ip-latitude'] || '0';
    const longitude = req.headers['x-vercel-ip-longitude'] || '0';
    const timezone = req.headers['x-vercel-ip-timezone'] || 'UTC';

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

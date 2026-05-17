const rateLimitMap = new Map();

const rateLimiter = (limit = 90, timeframeMs = 60000) => {
  return (req, res, next) => {
    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const now = Date.now();

    if (!rateLimitMap.has(ip)) {
      rateLimitMap.set(ip, []);
    }

    const requests = rateLimitMap.get(ip);
    const validRequests = requests.filter((timestamp) => now - timestamp < timeframeMs);
    validRequests.push(now);
    rateLimitMap.set(ip, validRequests);

    if (validRequests.length > limit) {
      return res.status(429).json({
        status: 'fail',
        message: 'Too many requests, please try again later.',
      });
    }

    next();
  };
};

export default rateLimiter;

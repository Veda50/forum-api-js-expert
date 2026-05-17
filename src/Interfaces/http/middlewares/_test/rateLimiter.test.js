import rateLimiter from '../rateLimiter.js';

describe('rateLimiter middleware', () => {
  it('should call next if request count is under the limit', () => {
    const middleware = rateLimiter(2, 60000);
    const req = { ip: '127.0.0.1' };
    const res = {};
    const next = vi.fn();

    middleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('should return 429 when request count exceeds the limit', () => {
    const middleware = rateLimiter(1, 60000);
    const req = { ip: '127.0.0.2' };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    const next = vi.fn();

    middleware(req, res, next);
    expect(next).toHaveBeenCalled();

    next.mockClear();
    middleware(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(429);
    expect(res.json).toHaveBeenCalledWith({
      status: 'fail',
      message: 'Too many requests, please try again later.',
    });
  });
});

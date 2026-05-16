export async function loggerMiddleware(
  req: Request,
  next: () => Promise<Response>,
): Promise<Response> {
  const start = Date.now();
  const url = new URL(req.url);
  const body = req.body ? '[Body]' : '[No Body]';

  // 1. Pass the request to the next layer
  const res = await next();

  // 2. After the handler finishes, calculate the time and log details
  const duration = Date.now() - start;

  console.log(
    `[%c${req.method}%c] %c${url.pathname}%c - %c${res.status}%c (${duration}ms) ${body}`,
    'color: green; font-weight: bold',
    'color: inherit',
    'color: cyan',
    'color: inherit',
    res.status < 400 ? 'color: green' : 'color: red',
    'color: inherit',
  );

  return res;
}

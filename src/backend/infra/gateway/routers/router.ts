import type { AppDependencies } from '@ipinstaq/shared/types/deps.ts';
import { routes } from './routes.ts';
import { NotFoundError } from '@ipinstaq/shared/errors.ts';
import type { AppRequest } from '../middleware/validation_middleware.ts';
import { unknown } from 'zod';
import { serveStatic } from '@ipinstaq/shared/utils/serveStaticFiles.ts';

const API_PREFIX = '/api';

async function router(req: Request, deps: AppDependencies): Promise<Response> {
  const url = new URL(req.url);
  let pathname = url.pathname;

  if (!pathname.startsWith(API_PREFIX)) {
    return await serveStatic(req)
  }

  pathname = pathname.slice(API_PREFIX.length);

  if (!pathname) pathname = '/';

  const route = routes.find((route) => {
    if (route.method !== req.method) return false;
    const params = matchPath(route.path, pathname);
    return params !== null;
  });

  if (!route) {
    throw new NotFoundError(`No route found for ${req.method} ${url.pathname}`);
  }

  const params = matchPath(route.path, pathname)!;

  const appRequest: AppRequest<unknown> = {
    req, // The actual Request object
    params: params,
    validated: unknown,
  };

  return await route.handler({ deps, req: appRequest });
}

function matchPath(routePath: string, requestPath: string): Record<string, string> | null {
  const routeParts = routePath.split('/').filter(Boolean);
  const requestParts = requestPath.split('/').filter(Boolean);

  if (routeParts.length !== requestParts.length) {
    return null;
  }

  const params: Record<string, string> = {};

  for (let i = 0; i < routeParts.length; i++) {
    const routePart = routeParts[i];
    const requestPart = requestParts[i];

    if (routePart.startsWith(':')) {
      params[routePart.slice(1)] = requestPart;
    } else if (routePart !== requestPart) {
      return null;
    }
  }

  return params;
}

export default router;

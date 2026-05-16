import type { AppDependencies } from '@ipinstaq/shared/types/deps.ts';
import type { AppRequest } from '../middleware/validation_middleware.ts';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export type RouteHandler = (data: { deps: AppDependencies; req: AppRequest }) => Promise<Response>;
// Business handlers
export type AppHandler<T> = (req: AppRequest<T>, deps: AppDependencies) => Promise<Response>;

export interface RouteDefinition {
  method: HttpMethod;
  path: string;
  handler: RouteHandler;
}

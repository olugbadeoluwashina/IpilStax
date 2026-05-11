import { projectRoutes } from './project_routes.ts';
import type { RouteDefinition } from './routing_types.ts';
import { testcaseRoutes } from './test_case_routes.ts';

export const routes: RouteDefinition[] = [
  ...projectRoutes,
  ...testcaseRoutes,
];

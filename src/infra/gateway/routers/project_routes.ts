import { TestProjectInputSchema } from '@ipinstaq/core/schema/test_project.ts';
import { createProjectHandler } from '../controllers/test_project_handler.ts';
import { withValidation } from '../middleware/validation_middleware.ts';
import type { RouteDefinition } from './routing_types.ts';

export const projectRoutes: RouteDefinition[] = [
    {
        method: "POST",
        path: "/testProject",
        handler: withValidation(TestProjectInputSchema, (req) => req.body, createProjectHandler)
    }
]
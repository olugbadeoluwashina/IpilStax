import { z } from 'zod';
import { BatchTestCaseSchema, TestCaseSchema } from '@ipinstaq/core/schema/test_case.ts';
import {
  createTestCaseHandler,
  editTestCaseHandler,
  getTestCaseHandler,
  listAllTestCasesHandler,
} from '../controllers/test_case_handler.ts';
import { withoutValidation, withValidation } from '../middleware/validation_middleware.ts';
import type { RouteDefinition } from './routing_types.ts';

export const testcaseRoutes: RouteDefinition[] = [
  {
    method: 'POST',
    path: '/testcases',
    handler: withValidation(BatchTestCaseSchema, (req) => req.body, createTestCaseHandler),
  },
  {
    method: 'GET',
    path: '/testcases/:id',
    handler: withValidation(z.uuid(), (req) => req.params?.id, getTestCaseHandler),
  },
  {
    method: 'GET',
    path: '/testcases',
    handler: withoutValidation(listAllTestCasesHandler),
  },
  {
    method: 'PATCH',
    path: '/testcases/:id',
    handler: withValidation( TestCaseSchema.partial(), (req) => ({ id: req.params?.id, ...req.body }), 
      editTestCaseHandler,
    ),
  },
];

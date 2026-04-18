import z from 'zod';
import { CreateTestCaseSchema, TestCaseSchema } from '@ipinstaq/core/schema/test_case.ts';
import { createTestCaseHandler, getTestCaseHandler, listAllTestCasesHandler, editTestCaseHandler } from '../controllers/test_case_handler.ts';
import { withValidation, withoutValidation } from '../middleware/validation_middleware.ts';
import type { RouteDefinition } from './routing_types.ts';

export const testcaseRoutes: RouteDefinition[] = [
  {
    method: "POST",
    path: "/testCases",
    handler: withValidation(CreateTestCaseSchema, (req) => req.body, createTestCaseHandler)
  },
  {
    method: "GET",
    path: "/testCases/:id",
    handler: withValidation(z.uuid(), (req) => req.params?.id, getTestCaseHandler)
  },
  {
    method: "GET",
    path: "/testCases",
    handler: withoutValidation(listAllTestCasesHandler)
  },
  {
    method: "PATCH",
    path: "/testCases/:id",
    handler: withValidation(TestCaseSchema.partial(), (req) => ({id: req.params?.id, ...req.body}), editTestCaseHandler)
  }

];
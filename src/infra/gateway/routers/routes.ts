
import { createTestCaseHandler, editTestCaseHandler, getTestCaseHandler, listAllTestCasesHandler } from '../controllers/test_case_handler.ts';
import { withoutValidation, withValidation } from '../middleware/validation_middleware.ts';
import type { RouteDefinition } from './routing_types.ts';
import { TestCaseSchema } from '@ipinstaq/core/schema/test_case.ts';
import z from 'zod';


export const routes: RouteDefinition[] = [
  {
    method: "POST",
    path: "/testCases",
    handler: withValidation(TestCaseSchema, (req) => req.body, createTestCaseHandler)
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
    handler: withValidation(z.object({
        id: z.uuid(), ...TestCaseSchema.omit({ id: true }).partial().shape,
    }), (req) => ({ id: req.params?.id, ...req.body }), editTestCaseHandler)
  }

];


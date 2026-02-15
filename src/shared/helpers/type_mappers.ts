import type { TestCase } from '@ipinstaq/core/schema/test_case.ts';
import type { ATestCase } from '../types/types.ts';

export function toTestCase(row: ATestCase ): TestCase {
  return {
    id: row.id,
    title: row.title,
    description: row.body,
    expectedResult: row.expected_result,
    status: row.status,
    version: row.version,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
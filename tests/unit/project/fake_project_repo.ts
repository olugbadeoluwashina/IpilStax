import type { ITestProjectRepository } from '@ipinstaq/core/logic/test_project/test_project_repo.ts';
import type { TestProject} from '../../../src/shared/types/types.ts';

export class FakeProjectRepo implements ITestProjectRepository {

    private projects: TestProject[] = [];

    create(testProject: TestProject): Promise<void> {
        console.log("Saving project to fake repository:", testProject);
        this.projects.push(testProject);
        return Promise.resolve();
    }

    isProjectCodeAvailable(projectCode: string): Promise<boolean> {
        const exists = this.projects.some(project => project.projectCode === projectCode);
        console.log(`Checking if project code "${projectCode}" has been used:`, exists);
        return Promise.resolve(!exists);
    }

    isProjectNameAvailable(name: string): Promise<boolean> {
        const exists = this.projects.find(project => project.name === name);
        return Promise.resolve(!exists);
    }

}

export function fakeProjectRepo() {
    return new FakeProjectRepo();
}

export function createTestProjectFactory(overrides?: Partial<TestProject>): TestProject {
    return {
        id: crypto.randomUUID(),
        name: 'Test Project',
        projectCode: 'TESTPROJ',
        description: 'A project for testing',
        createdAt: new Date(),
        updatedAt: new Date(),
        ...overrides,
    };
}

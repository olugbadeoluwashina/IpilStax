import type { TestProject, TestProjectInput } from '@ipinstaq/shared/types/types.ts';
import type { ITestProjectRepository } from './test_project_repo.ts';
import { ProjectCodeGenerator } from './project_code_generator.ts';

export class CreateProjectUseCase {

    constructor(private repo: ITestProjectRepository) {}

    async execute(data: TestProjectInput): Promise<TestProject | undefined> {

        const doesProjectExist = await this.repo.isProjectNameAvailable(data.name);

        if(!doesProjectExist) {
            return undefined;
        }

        const projectCode = await this.getAvailableProjectCode(data.name);

        const newProject: TestProject = {
            ...data,
            createdAt: new Date(),
            updatedAt: new Date(),
            projectCode,
            lastProjectCodeNumber: 0,
            id: crypto.randomUUID()
        }
                
        await this.repo.create(newProject);
        return newProject;
    }

    private async getAvailableProjectCode(name: string): Promise<string> {
        let baseCode = ProjectCodeGenerator.generate(name);
        let exists = await this.repo.isProjectCodeAvailable(baseCode);
        
        while(!exists) {
            baseCode = baseCode+baseCode.charAt(0).toLocaleUpperCase();
            exists = await this.repo.isProjectCodeAvailable(baseCode);
        }
        return baseCode;
    }
}
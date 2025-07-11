import { ApiResultRepository } from '../../infrastructure/repositories/ApiResultRepository';
import { GetResultsUseCase } from '../../domain/usecases/results/GetResultsUseCase';
import { CreateResultUseCase } from '../../domain/usecases/results/CreateResultUseCase';
import type { Result, DetailedResult, CreateResultRequest, UpdateResultRequest } from '../../domain/entities/Result';

export class ResultService {
  private repository: ApiResultRepository;
  private getResultsUseCase: GetResultsUseCase;
  private createResultUseCase: CreateResultUseCase;

  constructor() {
    this.repository = new ApiResultRepository();
    this.getResultsUseCase = new GetResultsUseCase(this.repository);
    this.createResultUseCase = new CreateResultUseCase(this.repository);
  }

  async getAllResults(): Promise<Result[]> {
    return await this.getResultsUseCase.execute();
  }

  async getAllResultsWithDetails(): Promise<DetailedResult[]> {
    return await this.getResultsUseCase.executeWithDetails();
  }

  async createResult(result: CreateResultRequest): Promise<Result> {
    return await this.createResultUseCase.execute(result);
  }

  async updateResult(result: UpdateResultRequest): Promise<Result> {
    return await this.repository.update(result);
  }

  async deleteResult(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async getResultsByIndicator(indicatorId: number): Promise<Result[]> {
    return await this.repository.getByIndicator(indicatorId);
  }

  async getResultsByHeadquarters(headquartersId: number): Promise<Result[]> {
    return await this.repository.getByHeadquarters(headquartersId);
  }

  async getIndicators(): Promise<Array<{id: number, name: string, code: string, measurementFrequency: string}>> {
    return await this.repository.getIndicators();
  }

  async getHeadquarters(): Promise<Array<{id: number, name: string}>> {
    return await this.repository.getHeadquarters();
  }
}
import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigValidationService {
  constructor(private readonly validatedConfig: Record<string, unknown>) {}

  get<T extends string | number | boolean = string>(key: string): T {
    return this.validatedConfig[key] as T;
  }
}

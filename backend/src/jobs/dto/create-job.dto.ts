import { IsString, IsArray } from 'class-validator';

export class CreateJobDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  location: string;

  @IsString()
  salaryRange: string;

  @IsArray()
  @IsString({ each: true })
  skills: string[];
}

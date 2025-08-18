import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, IsString, IsDate, IsBoolean } from 'class-validator';

@InputType()
export class SearchMedecinsInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  specialite?: string;

  @Field()
  @IsDate()
  date!: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  weekendOnly?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  city?: string; // Exemple de filtre supplémentaire
}

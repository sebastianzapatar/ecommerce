import { IsArray, 
    IsInt, 
    IsPositive, IsString, 
    MinLength, IsIn, 
    IsNumber,
    IsOptional} from "class-validator";

export class CreateProductDto {
    @IsString()
    @MinLength(1)
    title:string;
    
    @IsPositive()
    @IsNumber()
    price?:number;
    @IsString()
    description?:string;
    @IsInt()
    @IsPositive()
    stock?:number;
    @IsString({each:true})
    @IsArray()
    sizes:string[];
    @IsIn(['F','M','U'])
    gender:string;
    @IsString()
    slug:string

    @IsString({each:true})
    @IsArray()
    @IsOptional()
    images?:string[];
}

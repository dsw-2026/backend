import { IsString, IsNotEmpty } from 'class-validator'

export class EspecieDto {
  @IsString({ message: 'El nombre debe ser texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  nombre!: string
}

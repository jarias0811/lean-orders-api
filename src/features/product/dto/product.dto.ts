import { ApiProperty } from '@nestjs/swagger';

export class ProductDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  stock: number;

  @ApiProperty()
  name: string;

  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.stock = data.stock;
  }
}

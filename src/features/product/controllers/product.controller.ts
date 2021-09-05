import { Controller, Get, Logger } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProductDTO } from '../dto/product.dto';
import { convertProductEntityToDTO } from '../../../common/utils';
import { ProductService } from '../services/product.service';

@ApiTags('product')
@Controller('producto')
export class ProductController {
  private logger = new Logger(ProductController.name);

  constructor(private productService: ProductService) {}

  @Get()
  @ApiOperation({ summary: 'Returns a list of the existing products' })
  @ApiOkResponse({ description: 'List of products', type: [ProductDTO] })
  async getProducts(): Promise<ProductDTO[]> {
    this.logger.log('Fetching all the products');
    const products = await this.productService.getProducts();
    return convertProductEntityToDTO(products);
  }
}

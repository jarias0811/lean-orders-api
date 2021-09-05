import { ProductDTO } from '../features/product/dto/product.dto';
import { Product } from '../entities';

export function convertProductEntityToDTO(products: Product[]): ProductDTO[] {
  return products.map((product) => new ProductDTO(product));
}

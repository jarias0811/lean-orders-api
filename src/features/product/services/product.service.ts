import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../repository/products.repository';
import { ProductDTO } from '../dto/product.dto';
import { Product } from '../../../entities';

@Injectable()
export class ProductService {
  constructor(private productRepository: ProductRepository) {}

  getProducts() {
    return this.productRepository.find();
  }

  getProductById(id: number) {
    return this.productRepository.findOne({
      where: {
        id,
      },
    });
  }

  createProduct(productDto: ProductDTO): Promise<Product> {
    const productToSave = this.productRepository.create({
      id: productDto.id,
      name: productDto.name,
      stock: productDto.stock,
    });

    return productToSave.save();
  }
}

import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { ProductRepository } from '../repository/products.repository';
import { Product } from '../../../entities';

const mockProductRepository = () => ({
  findOne: jest.fn(),
  create: jest.fn(),
});

describe('ProductsService', () => {
  let service: ProductService;
  let productRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: ProductRepository,
          useFactory: mockProductRepository,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    productRepository = module.get<ProductRepository>(ProductRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Should call product repository and find a product by id', async () => {
    const productId = 1;
    const resultProduct: Partial<Product> = {
      stock: 0,
      name: 'test',
      id: productId,
      orders: [],
    };
    jest.spyOn(productRepository, 'findOne');

    productRepository.findOne.mockResolvedValue(resultProduct);

    expect(await service.getProductById(productId)).toEqual(resultProduct);
    expect(productRepository.findOne).toHaveBeenCalledWith({
      where: { id: productId },
    });
  });
});

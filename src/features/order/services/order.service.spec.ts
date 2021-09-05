import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { OrderRepository } from '../repository/order.repository';
import { ProductService } from '../../product/services/product.service';
import { MAX_BUY_PER_MONTH, OrderType } from '../order.constants';
import { Order, Product } from '../../../entities';
import { BadRequestException } from '@nestjs/common';
import { CreateOrderDTO } from '../dto/order.dto';
import { CommonResponse } from '../../../common/common.dto';

const mockOrderRepository = () => ({
  create: jest.fn(),
  getTotalOrdersForDateAndProduct: jest.fn(),
});

const mockProductService = () => ({
  getProductById: jest.fn(),
});

describe('OrderService', () => {
  let service: OrderService;
  let productService;
  let orderRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: OrderRepository,
          useFactory: mockOrderRepository,
        },
        {
          provide: ProductService,
          useFactory: mockProductService,
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    productService = module.get<ProductService>(ProductService);
    orderRepository = module.get<OrderRepository>(OrderRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('#getTotalBuyOrdersForDateAndProduct', () => {
    it('Should return the count from the repository function', async () => {
      const date = '2021-09-12';
      const productId = 1;
      const month = 9;
      const year = 2021;
      const result = 15;

      jest
        .spyOn(orderRepository, 'getTotalOrdersForDateAndProduct')
        .mockResolvedValue(result);

      expect(
        await service.getTotalBuyOrdersForDateAndProduct(date, productId),
      ).toEqual(result);
      expect(
        orderRepository.getTotalOrdersForDateAndProduct,
      ).toHaveBeenCalledWith(month, year, productId, OrderType.Buy);
    });

    it('Should return 0 if the repository returns undefined', async () => {
      const date = '2021-09-12';
      const productId = 1;
      const result = 0;

      jest
        .spyOn(orderRepository, 'getTotalOrdersForDateAndProduct')
        .mockResolvedValue(undefined);

      expect(
        await service.getTotalBuyOrdersForDateAndProduct(date, productId),
      ).toEqual(result);
    });
  });

  describe('#validateBuyOrdersLimit', () => {
    it('Should throw an exception if the quantity to add plus the sum of the other orders for the month is superior to the month_limit', async () => {
      const totalOrdersCount = 15;
      const quantityToAdd = 16;
      const date = '2021-09-12';
      const product: Partial<Product> = {
        stock: 0,
        name: 'test',
        id: 1,
      };

      jest
        .spyOn(service, 'getTotalBuyOrdersForDateAndProduct')
        .mockResolvedValue(totalOrdersCount);

      try {
        await service.validateBuyOrdersLimit(
          date,
          <Product>product,
          quantityToAdd,
        );
      } catch (error) {
        expect(error.message).toEqual(
          `Limite de ${MAX_BUY_PER_MONTH} compras para el mes se exceden con esta compra. Compras actuales del mes: ${totalOrdersCount}. Inventario actual: ${product.stock}`,
        );
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
  });

  describe('#validateIfSaleIsPossible', () => {
    it('Should throw an exception if the product is undefined', () => {
      const createOrderDTO: CreateOrderDTO = {
        quantity: 1,
        date: '2021-091-08',
        productId: 1,
        productName: 'test',
      };
      const product = undefined;

      try {
        service.validateIfSaleIsPossible(product, createOrderDTO);
      } catch (error) {
        expect(error.message).toEqual(
          `El producto ingresado no esta registrado en el sistema`,
        );
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });

    it('Should throw an exception if the product does not have enough stock', () => {
      const createOrderDTO: CreateOrderDTO = {
        quantity: 20,
        date: '2021-091-08',
        productId: 1,
        productName: 'test',
      };

      const product: Partial<Product> = {
        stock: 10,
        name: 'test',
        id: 1,
      };

      try {
        service.validateIfSaleIsPossible(<Product>product, createOrderDTO);
      } catch (error) {
        expect(error.message).toEqual(
          `No hay inventario suficiente para la orden de venta ingresada. Inventario actual: ${product.stock}`,
        );
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
  });

  describe('#createBuyOrder', () => {
    it('Should validate quantity limit and add the quantity to the stock', async () => {
      const product: Partial<Product> = {
        stock: 10,
        name: 'test',
        id: 1,
        save: jest.fn(),
      };

      const createOrderDTO: CreateOrderDTO = {
        quantity: 20,
        date: '2021-091-08',
        productId: 1,
        productName: 'test',
      };

      const buyOrder: Partial<Order> = {
        id: 1,
        quantity: createOrderDTO.quantity,
        date: createOrderDTO.date,
        productId: createOrderDTO.productId,
        type: OrderType.Buy,
      };

      const expectedResult = new CommonResponse({
        data: {
          buyOrder: {
            ...buyOrder,
            product: {
              ...product,
              stock: product.stock + createOrderDTO.quantity,
            },
          },
        },
        message: 'Orden de compra creada correctamente',
      });

      jest.spyOn(productService, 'getProductById').mockResolvedValue(product);
      jest.spyOn(service, 'validateBuyOrdersLimit').mockResolvedValue();
      jest.spyOn(service, 'createOrder').mockResolvedValue(<Order>buyOrder);
      jest.spyOn(product, 'save');

      const result = await service.createBuyOrder(createOrderDTO);

      expect(service.validateBuyOrdersLimit).toHaveBeenCalledWith(
        createOrderDTO.date,
        product,
        createOrderDTO.quantity,
      );
      expect(service.createOrder).toHaveBeenCalledWith(
        createOrderDTO,
        OrderType.Buy,
      );
      expect(product.save).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });
  });
});

import { BadRequestException, Injectable } from '@nestjs/common';
import { OrderRepository } from '../repository/order.repository';
import { CreateOrderDTO } from '../dto/order.dto';
import { ProductService } from '../../product/services/product.service';
import { MAX_BUY_PER_MONTH, OrderType } from '../order.constants';
import { CommonResponse } from '../../../common/common.dto';
import { Product } from '../../../entities';

@Injectable()
export class OrderService {
  constructor(
    private orderRepository: OrderRepository,
    private productService: ProductService,
  ) {}

  async getTotalBuyOrdersForDateAndProduct(
    date: string,
    productId,
  ): Promise<number> {
    const month = new Date(date).getMonth() + 1;
    const year = new Date(date).getFullYear();

    const count = await this.orderRepository.getTotalOrdersForDateAndProduct(
      month,
      year,
      productId,
      OrderType.Buy,
    );

    return count || 0;
  }

  async createBuyOrder(createBuyOrderDTO: CreateOrderDTO): Promise<any> {
    let product = await this.productService.getProductById(
      createBuyOrderDTO.productId,
    );

    if (!product) {
      product = await this.productService.createProduct({
        id: createBuyOrderDTO.productId,
        name: createBuyOrderDTO.productName,
        stock: 0,
      });
    }

    await this.validateBuyOrdersLimit(
      createBuyOrderDTO.date,
      product,
      createBuyOrderDTO.quantity,
    );

    const buyOrder = await this.createOrder(createBuyOrderDTO, OrderType.Buy);

    product.stock = product.stock + buyOrder.quantity;
    await product.save();

    buyOrder.product = product;

    return new CommonResponse({
      message: 'Orden de compra creada correctamente',
      data: {
        buyOrder,
      },
    });
  }

  async createSaleOrder(createOrderDTO: CreateOrderDTO) {
    const product = await this.productService.getProductById(
      createOrderDTO.productId,
    );

    this.validateIfSaleIsPossible(product, createOrderDTO);

    const saleOrder = await this.createOrder(createOrderDTO, OrderType.Sale);

    product.stock = product.stock - saleOrder.quantity;
    await product.save();

    saleOrder.product = product;

    return new CommonResponse({
      message: 'Orden de venta creada correctamente',
      data: {
        saleOrder,
      },
    });
  }

  validateIfSaleIsPossible(product: Product, createOrderDTO: CreateOrderDTO) {
    if (!product) {
      throw new BadRequestException(
        'El producto ingresado no esta registrado en el sistema',
      );
    }

    if (product.stock < createOrderDTO.quantity) {
      throw new BadRequestException(
        `No hay inventario suficiente para la orden de venta ingresada. Inventario actual: ${product.stock}`,
      );
    }
  }

  async validateBuyOrdersLimit(
    date: string,
    product: Product,
    quantityToAdd: number,
  ) {
    const buyOrdersForCurrentMonth: number =
      await this.getTotalBuyOrdersForDateAndProduct(date, product.id);

    if (buyOrdersForCurrentMonth + quantityToAdd > MAX_BUY_PER_MONTH) {
      throw new BadRequestException(
        `Limite de ${MAX_BUY_PER_MONTH} compras para el mes se exceden con esta compra. Compras actuales del mes: ${buyOrdersForCurrentMonth}. Inventario actual: ${product.stock}`,
      );
    }
  }

  async createOrder(createOrderDTO: CreateOrderDTO, type: OrderType) {
    return await this.orderRepository
      .create({
        date: createOrderDTO.date,
        productId: createOrderDTO.productId,
        quantity: createOrderDTO.quantity,
        type,
      })
      .save();
  }
}

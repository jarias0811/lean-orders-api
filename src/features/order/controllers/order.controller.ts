import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { CreateOrderDTO } from '../dto/order.dto';
import { OrderService } from '../services/order.service';
import { CommonResponse } from '../../../common/common.dto';

@Controller('')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post('registrar-compra')
  @ApiOperation({ summary: 'Registers a new buy order for a product' })
  createBuyOrder(
    @Body() createBuyOrderDTO: CreateOrderDTO,
  ): Promise<CommonResponse> {
    return this.orderService.createBuyOrder(createBuyOrderDTO);
  }

  @Post('registrar-venta')
  @ApiOperation({ summary: 'Registers a new sale order for a product' })
  createSaleOrder(
    @Body() createBuyOrderDTO: CreateOrderDTO,
  ): Promise<CommonResponse> {
    return this.orderService.createSaleOrder(createBuyOrderDTO);
  }
}

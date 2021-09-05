import { Module } from '@nestjs/common';
import { OrderService } from './services/order.service';
import { OrderController } from './controllers/order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderRepository } from './repository/order.repository';
import { ProductModule } from '../product/products.module';

@Module({
  imports: [TypeOrmModule.forFeature([OrderRepository]), ProductModule],
  providers: [OrderService],
  controllers: [OrderController],
})
export class OrderModule {}

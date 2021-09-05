import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm';
import { ProductModule } from './features/product/products.module';
import { OrderModule } from './features/order/order.module';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), ProductModule, OrderModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

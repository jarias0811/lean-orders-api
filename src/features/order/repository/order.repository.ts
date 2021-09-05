import { EntityRepository, Repository } from 'typeorm';
import { Order } from '../../../entities';

@EntityRepository(Order)
export class OrderRepository extends Repository<Order> {
  async getTotalOrdersForDateAndProduct(
    month: number,
    year: number,
    productId: number,
    type: string,
  ): Promise<number> {
    const query = this.createQueryBuilder('o')
      .select(`SUM(quantity)`)
      .where(`extract(month from o."date") = :month`, { month })
      .andWhere(`extract(year from o."date") = :year`, { year })
      .andWhere(`o.product_id = :productId`, { productId })
      .andWhere(`o.type = :type`, { type: type });

    return Number((await query.getRawOne()).sum);
  }
}

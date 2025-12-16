import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expense } from '../entities/expense.entity';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(Expense)
    private expenseRepo: Repository<Expense>,
  ) {}

  async list(filters: any = {}) {
    const { month, year, type, category, limit, offset } = filters;
    const qb = this.expenseRepo.createQueryBuilder('e');
    if (type) qb.andWhere('e.type = :type', { type });
    if (category) qb.andWhere('e.category = :category', { category });
    if (month) qb.andWhere("TO_CHAR(e.date, 'MM') = :month", { month: month.toString().padStart(2, '0') });
    if (year) qb.andWhere("TO_CHAR(e.date, 'YYYY') = :year", { year: year.toString() });
    qb.orderBy('e.date', 'DESC');
    if (offset) qb.skip(parseInt(offset, 10));
    if (limit) qb.take(parseInt(limit, 10));
    return await qb.getMany();
  }

  async create(expense: any) {
    const e = this.expenseRepo.create({ ...expense, id: expense.id || (Date.now().toString(36) + Math.random().toString(36).slice(2, 8)), date: new Date(expense.date) });
    return await this.expenseRepo.save(e);
  }

  async update(id: string, updated: any) {
    const existing = await this.expenseRepo.findOneBy({ id });
    if (!existing) throw new NotFoundException('Expense not found');
    const merged = this.expenseRepo.merge(existing, { ...updated, id, date: updated.date ? new Date(updated.date) : existing.date });
    return await this.expenseRepo.save(merged);
  }

  async remove(id: string) {
    const res = await this.expenseRepo.delete({ id });
    if (res.affected === 0) throw new NotFoundException('Expense not found');
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SavingsGoal } from '../entities/goal.entity';
import { GoalTransaction } from '../entities/goal-transaction.entity';

@Injectable()
export class GoalsService {
  constructor(
    @InjectRepository(SavingsGoal)
    private goalsRepo: Repository<SavingsGoal>,
    @InjectRepository(GoalTransaction)
    private txRepo: Repository<GoalTransaction>,
  ) {}

  async findAll() {
    return await this.goalsRepo.find({ relations: ['history'] });
  }

  async create(goal: any) {
    const g = this.goalsRepo.create({
      id: goal.id || (Date.now().toString(36) + Math.random().toString(36).slice(2, 8)),
      name: goal.name,
      targetAmount: goal.targetAmount || 0,
      currentAmount: goal.currentAmount || 0,
      deadline: goal.deadline ? new Date(goal.deadline) : null,
      color: goal.color || '#cccccc',
      history: [],
    });
    return await this.goalsRepo.save(g);
  }

  async update(id: string, updated: any) {
    const existing = await this.goalsRepo.findOne({ where: { id }, relations: ['history'] });
    if (!existing) throw new NotFoundException('Goal not found');
    const merged = this.goalsRepo.merge(existing, {
      ...updated,
      deadline: updated.deadline ? new Date(updated.deadline) : existing.deadline,
    });
    return await this.goalsRepo.save(merged);
  }

  async remove(id: string) {
    const res = await this.goalsRepo.delete({ id });
    if (res.affected === 0) throw new NotFoundException('Goal not found');
  }

  async addDeposit(goalId: string, amount: number, note?: string) {
    const goal = await this.goalsRepo.findOne({ where: { id: goalId }, relations: ['history'] });
    if (!goal) throw new NotFoundException('Goal not found');
    const tx = this.txRepo.create({
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
      date: new Date(),
      amount,
      note: note || '',
      goal,
    });
    await this.txRepo.save(tx);
    goal.currentAmount = (goal.currentAmount || 0) + amount;
    await this.goalsRepo.save(goal);
    return tx;
  }

  async removeDeposit(goalId: string, transactionId: string) {
    const tx = await this.txRepo.findOne({ where: { id: transactionId }, relations: ['goal'] });
    if (!tx || !tx.goal || tx.goal.id !== goalId) throw new NotFoundException('Transaction not found');
    const amount = tx.amount || 0;
    await this.txRepo.delete({ id: transactionId });
    const goal = await this.goalsRepo.findOne({ where: { id: goalId } });
    if (goal) {
      goal.currentAmount = (goal.currentAmount || 0) - amount;
      await this.goalsRepo.save(goal);
    }
  }
}

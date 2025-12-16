import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoalsService } from './goals.service';
import { GoalsController } from './goals.controller';
import { SavingsGoal } from '../entities/goal.entity';
import { GoalTransaction } from '../entities/goal-transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SavingsGoal, GoalTransaction])],
  controllers: [GoalsController],
  providers: [GoalsService],
})
export class GoalsModule {}

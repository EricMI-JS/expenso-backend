import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpensesModule } from './expenses/expenses.module';
import { GoalsModule } from './goals/goals.module';
import { Expense } from './entities/expense.entity';
import { SavingsGoal } from './entities/goal.entity';
import { GoalTransaction } from './entities/goal-transaction.entity';

const DEFAULT_DB =
  process.env.DATABASE_URL ||
  "postgresql://neondb_owner:npg_hECLwug61iXJ@ep-sparkling-wave-adbahr0g-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: DEFAULT_DB,
      // Neon requires SSL; Node's pg driver uses `ssl: { rejectUnauthorized: false }`
      ssl: { rejectUnauthorized: false },
      entities: [Expense, SavingsGoal, GoalTransaction],
      synchronize: true,
      logging: false,
    }),
    ExpensesModule,
    GoalsModule,
  ],
})
export class AppModule {}

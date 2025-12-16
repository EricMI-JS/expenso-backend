import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { SavingsGoal } from './goal.entity';

@Entity({ name: 'goal_transactions' })
export class GoalTransaction {
  @PrimaryColumn()
  id: string;

  @Column({ type: 'timestamptz' })
  date: Date;

  @Column('float')
  amount: number;

  @Column()
  note: string;

  @ManyToOne(() => SavingsGoal, (goal) => goal.history, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'goalId' })
  goal: SavingsGoal;
}

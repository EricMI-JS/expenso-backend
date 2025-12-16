import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { GoalTransaction } from './goal-transaction.entity';

@Entity({ name: 'goals' })
export class SavingsGoal {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column('float')
  targetAmount: number;

  @Column('float')
  currentAmount: number;

  @Column({ type: 'timestamptz', nullable: true })
  deadline?: Date;

  @Column()
  color: string;

  @OneToMany(() => GoalTransaction, (tx) => tx.goal, { cascade: true })
  history: GoalTransaction[];
}

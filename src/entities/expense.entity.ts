import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity({ name: 'expenses' })
export class Expense {
  @PrimaryColumn()
  id: string;

  @Column()
  type: string;

  @Column('float')
  amount: number;

  @Column()
  category: string;

  @Column({ type: 'timestamptz' })
  date: Date;

  @Column()
  method: string;

  @Column({ nullable: true })
  note?: string;
}

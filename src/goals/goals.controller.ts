import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode } from '@nestjs/common';
import { GoalsService } from './goals.service';

@Controller('goals')
export class GoalsController {
  constructor(private readonly service: GoalsService) {}

  @Get()
  async getAll() {
    return { goals: await this.service.findAll() };
  }

  @Post()
  create(@Body() body: any) {
    return this.service.create(body);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.service.update(id, body);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    this.service.remove(id);
  }

  @Post(':goalId/deposits')
  async addDeposit(@Param('goalId') goalId: string, @Body() body: any) {
    return await this.service.addDeposit(goalId, body.amount, body.note);
  }

  @Delete(':goalId/deposits/:transactionId')
  @HttpCode(204)
  async removeDeposit(@Param('goalId') goalId: string, @Param('transactionId') txId: string) {
    await this.service.removeDeposit(goalId, txId);
  }
}

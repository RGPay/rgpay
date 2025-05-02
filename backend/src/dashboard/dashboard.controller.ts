import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { DashboardService, DashboardFilter } from './dashboard.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('metrics')
  async getMetrics(
    @Query('periodoInicio') periodoInicio?: string,
    @Query('periodoFim') periodoFim?: string,
    @Query('id_unidade') id_unidade?: string,
  ) {
    const filter: DashboardFilter = {};

    if (periodoInicio) {
      filter.periodoInicio = new Date(periodoInicio);
    }

    if (periodoFim) {
      filter.periodoFim = new Date(periodoFim);
    }

    if (id_unidade) {
      filter.id_unidade = parseInt(id_unidade, 10);
    }

    return this.dashboardService.getMetrics(filter);
  }

  @Get('faturamento-por-hora')
  async getFaturamentoPorHora(
    @Query('eventId') eventId?: string,
    @Query('id_unidade') id_unidade?: string,
    @Query('periodoInicio') periodoInicio?: string,
    @Query('periodoFim') periodoFim?: string,
  ) {
    const eventIdNum = eventId ? parseInt(eventId, 10) : undefined;
    const unidadeIdNum = id_unidade ? parseInt(id_unidade, 10) : undefined;
    return this.dashboardService.getFaturamentoPorHora(
      eventIdNum,
      unidadeIdNum,
      periodoInicio,
      periodoFim,
    );
  }
}

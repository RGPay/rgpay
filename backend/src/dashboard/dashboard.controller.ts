import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { DashboardService, DashboardFilter } from './dashboard.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Dashboard')
@ApiBearerAuth('JWT-auth')
@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('metrics')
  @ApiOperation({ summary: 'Get dashboard metrics' })
  @ApiQuery({
    name: 'periodoInicio',
    required: false,
    description: 'Start date (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'periodoFim',
    required: false,
    description: 'End date (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'id_unidade',
    required: false,
    description: 'Unit ID filter',
  })
  @ApiQuery({
    name: 'id_evento',
    required: false,
    description: 'Event ID filter',
  })
  @ApiResponse({
    status: 200,
    description: 'Dashboard metrics retrieved successfully',
  })
  async getMetrics(
    @Query('periodoInicio') periodoInicio?: string,
    @Query('periodoFim') periodoFim?: string,
    @Query('id_unidade') id_unidade?: string,
    @Query('id_evento') id_evento?: string,
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

    if (id_evento) {
      filter.id_evento = parseInt(id_evento, 10);
    }

    return this.dashboardService.getMetrics(filter);
  }

  @Get('faturamento-por-hora')
  @ApiOperation({ summary: 'Get revenue by hour' })
  @ApiQuery({
    name: 'eventId',
    required: false,
    description: 'Event ID filter',
  })
  @ApiQuery({
    name: 'id_unidade',
    required: false,
    description: 'Unit ID filter',
  })
  @ApiQuery({
    name: 'periodoInicio',
    required: false,
    description: 'Start date (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'periodoFim',
    required: false,
    description: 'End date (YYYY-MM-DD)',
  })
  @ApiResponse({
    status: 200,
    description: 'Revenue by hour data retrieved successfully',
  })
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

  @Get('ticket-medio-por-hora')
  @ApiOperation({ summary: 'Get average ticket by hour' })
  @ApiQuery({
    name: 'eventId',
    required: false,
    description: 'Event ID filter',
  })
  @ApiQuery({
    name: 'id_unidade',
    required: false,
    description: 'Unit ID filter',
  })
  @ApiQuery({
    name: 'periodoInicio',
    required: false,
    description: 'Start date (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'periodoFim',
    required: false,
    description: 'End date (YYYY-MM-DD)',
  })
  @ApiResponse({
    status: 200,
    description: 'Average ticket by hour data retrieved successfully',
  })
  async getTicketMedioPorHora(
    @Query('eventId') eventId?: string,
    @Query('id_unidade') id_unidade?: string,
    @Query('periodoInicio') periodoInicio?: string,
    @Query('periodoFim') periodoFim?: string,
  ) {
    const eventIdNum = eventId ? parseInt(eventId, 10) : undefined;
    const unidadeIdNum = id_unidade ? parseInt(id_unidade, 10) : undefined;
    return this.dashboardService.getTicketMedioPorHora(
      eventIdNum,
      unidadeIdNum,
      periodoInicio,
      periodoFim,
    );
  }
}

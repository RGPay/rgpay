import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { RelatoriosService } from './relatorios.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  RelatorioFilterDto,
  FaturamentoProdutoResponse,
} from './relatorios.dto';

@Controller('relatorios')
@UseGuards(JwtAuthGuard)
export class RelatoriosController {
  constructor(private readonly relatoriosService: RelatoriosService) {}

  @Get('faturamento-produtos')
  async getFaturamentoProdutos(
    @Query() filterDto: RelatorioFilterDto,
  ): Promise<FaturamentoProdutoResponse> {
    return this.relatoriosService.getFaturamentoProdutos(filterDto);
  }
}

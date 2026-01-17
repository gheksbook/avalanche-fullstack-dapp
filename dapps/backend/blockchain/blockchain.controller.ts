import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BlockchainService } from './blockchain.service';
import { GetEventsDto } from './dto/get-events.dto';

@Controller('blockchain')
export class BlockchainController {
  constructor(private readonly blockchainService: BlockchainService) {}

  @Get('value')
  async getValue() {
    try {
      const value = await this.blockchainService.getLatestValue();

      return {
        success: true,
        data: value,
        timestamp: new Date().toISOString(),
      };
    } catch (err) {
      throw new HttpException(
        { success: false, message: err.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('events')
  async getEvents(@Body() body: GetEventsDto) {
    try {
      const events = await this.blockchainService.getValueUpdatedEvents(
        body.fromBlock,
        body.toBlock,
      );

      return {
        success: true,
        count: events.length,
        data: events,
        timestamp: new Date().toISOString(),
      };
    } catch (err) {
      throw new HttpException(
        { success: false, message: err.message },
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }


  @Get('events')
  async getEventsQuery(
    @Query('from') fromBlock?: number,
    @Query('to') toBlock?: number,
  ) {
    try {
      if (!fromBlock || !toBlock) {
        throw new HttpException(
          { success: false, message: 'from dan to wajib diisi' },
          HttpStatus.BAD_REQUEST,
        );
      }

      const events = await this.blockchainService.getValueUpdatedEvents(
        Number(fromBlock),
        Number(toBlock),
      );

      return {
        success: true,
        count: events.length,
        data: events,
        timestamp: new Date().toISOString(),
      };
    } catch (err) {
      throw new HttpException(
        { success: false, message: err.message },
        err.status || HttpStatus.BAD_REQUEST,
      );
    }
  }
}

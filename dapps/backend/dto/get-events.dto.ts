import { BadRequestException } from '@nestjs/common';
import { IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetEventsDto {
  @Type(() => Number)
  @IsNumber({ allowNaN: false })
  @Min(0)
  fromBlock: number;

  @Type(() => Number)
  @IsNumber({ allowNaN: false })
  @Min(0)
  toBlock: number;

  validateRange() {
    if (this.toBlock - this.fromBlock > 2048) {
      throw new BadRequestException('Range block terlalu besar, maksimum 2048.');
    }

    if (this.toBlock < this.fromBlock) {
      throw new BadRequestException('`toBlock` harus lebih besar dari `fromBlock`.');
    }
  }
}

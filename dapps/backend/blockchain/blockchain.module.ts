import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BlockchainService } from './blockchain.service';
import { BlockchainController } from './blockchain.controller';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [BlockchainController],
  providers: [BlockchainService],
})
export class BlockchainModule {}

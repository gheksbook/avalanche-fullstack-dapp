import {
  Injectable,
  InternalServerErrorException,
  ServiceUnavailableException,
  BadRequestException,
} from '@nestjs/common';
import { createPublicClient, http, parseAbiItem, PublicClient } from 'viem';
import { avalancheFuji } from 'viem/chains';
import SIMPLE_STORAGE from './simple-storage.json';

@Injectable()
export class BlockchainService {
  private client: PublicClient;
  private contractAddress: `0x${string}`;

  constructor() {
    const rpcUrl = process.env.FUJI_RPC || 'https://api.avax-test.network/ext/bc/C/rpc';

    this.client = createPublicClient({
      chain: avalancheFuji,
      transport: http(rpcUrl),
    });

    this.contractAddress = (process.env.CONTRACT_ADDRESS ||
      '0x30bB041a81191e0f91D16a074804B94d0E7524E4') as `0x${string}`;
  }

  async getLatestValue() {
    try {
      const value = await this.client.readContract({
        address: this.contractAddress,
        abi: SIMPLE_STORAGE.abi,
        functionName: 'getValue',
      }) as bigint;

      return { value: value.toString() };
    } catch (error) {
      this.handleRpcError(error);
    }
  }


  async getValueUpdatedEvents(fromBlock: number, toBlock: number) {
    try {
      if (toBlock < fromBlock) {
        throw new BadRequestException('toBlock tidak boleh lebih kecil dari fromBlock');
      }

      if (toBlock - fromBlock > 2048) {
        throw new BadRequestException('Range block terlalu besar. Maksimal 2048 block.');
      }

      const logs = await this.client.getLogs({
        address: this.contractAddress,
        event: parseAbiItem('event ValueUpdated(uint256 newValue)'),
        fromBlock: BigInt(fromBlock),
        toBlock: BigInt(toBlock),
      });

      return logs.map(log => ({
        blockNumber: log.blockNumber?.toString(),
        value: (log.args?.newValue as bigint)?.toString(),
        txHash: log.transactionHash,
      }));
    } catch (error) {
      this.handleRpcError(error);
    }
  }

  
  private handleRpcError(error: unknown): never {
    const message = error instanceof Error ? error.message : String(error);
    console.error('[RPC Error]', message);

    if (message.includes('timeout')) {
      throw new ServiceUnavailableException('RPC timeout, coba lagi.');
    }

    if (
      message.includes('network') ||
      message.includes('fetch') ||
      message.includes('ECONNRESET') ||
      message.includes('failed')
    ) {
      throw new ServiceUnavailableException('RPC tidak dapat dijangkau.');
    }

    throw new InternalServerErrorException('Gagal membaca data dari blockchain.');
  }
}

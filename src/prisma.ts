import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import "dotenv/config";

@Injectable()
export class PrismaService extends PrismaClient {
  private isConnected: boolean = false;

  async onModuleInit() {
    if (!this.isConnected) {
      await this.$connect();
      this.isConnected = true;
    }
  }

  async onModuleDestroy() {
    if (this.isConnected) {
      await this.$disconnect();
      this.isConnected = false;
    }
  }
}

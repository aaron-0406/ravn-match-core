import { PrismaClient } from '@prisma/client';
import config from './config/config';

// INFO: add prisma to the NodeJS global type
interface CustomNodeJsGlobal extends Global {
  prisma: PrismaClient;
}

// INFO: Prevent multiple instances of Prisma Client in development
declare const global: CustomNodeJsGlobal;

const prisma = global.prisma || new PrismaClient();

if (config.env === 'development') global.prisma = prisma;

export default prisma;

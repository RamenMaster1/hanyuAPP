// scripts/syncProgress.ts 
import { PrismaClient } from '@prisma/client';
import Redis from 'ioredis';

const prisma = new PrismaClient();
const redis = new Redis(process.env.REDIS_URL || 'redis://redis:6379');

async function sync() {
  const dirtyUsers = await redis.smembers('dirty_users'); // 获取所有有更新的用户 
  console.log(`正在同步 ${dirtyUsers.length} 个用户的进度...`);

  for (const userId of dirtyUsers) {
    const numericUserId = Number(userId);
    const userKey = `user_progress:${userId}`;
    const tsKey = `user_progress_ts:${userId}`;
    const allProgress = await redis.hgetall(userKey);
    const tsMap = await redis.hgetall(tsKey);

    for (const [field, status] of Object.entries(allProgress)) {
      const [bookId, wordId] = field.split(':');
      const redisTimestamp = Number(tsMap[field] ?? 0);
      const existing = await prisma.wordProgress.findUnique({
        where: {
          userId_bookId_wordId: { userId: numericUserId, bookId, wordId }
        },
        select: { updatedAt: true }
      });

      if (existing && redisTimestamp && existing.updatedAt.getTime() >= redisTimestamp) {
        continue;
      }
      // 使用 upsert 确保：存在则更新，不存在则创建 
      await prisma.wordProgress.upsert({
        where: {
          userId_bookId_wordId: { userId: numericUserId, bookId, wordId }
        },
        update: { status },
        create: { userId: numericUserId, bookId, wordId, status },
      });
    }
    // 同步成功后，从脏数据集合中移除 
    await redis.srem('dirty_users', userId);
  }
  console.log('同步完成');
  process.exit(0);
}

sync().catch(err => { console.error(err); process.exit(1); });

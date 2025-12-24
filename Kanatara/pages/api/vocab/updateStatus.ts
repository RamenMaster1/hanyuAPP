// pages/api/vocab/updateStatus.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import redis from '../../../lib/redis';
import { getUserIdFromSession } from '../../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const userId = await getUserIdFromSession(req);
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  const { bookId, wordId, status } = req.body;
  if (!bookId || !wordId || !status) return res.status(400).json({ message: 'Missing params' });

  try {
    // 1. 写入 Redis Hash (user_progress:{userId}) 并附带时间戳
    const userKey = `user_progress:${userId}`;
    const tsKey = `user_progress_ts:${userId}`;
    const field = `${bookId}:${wordId}`;
    const now = Date.now().toString();

    await redis
      .multi()
      .hset(userKey, field, status)
      .hset(tsKey, field, now)
      .sadd('dirty_users', userId.toString())
      .exec();

    return res.status(200).json({ success: true, userId });
  } catch (error) {
    console.error('Redis update error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

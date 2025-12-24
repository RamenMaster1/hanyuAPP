// lib/auth.ts
import { NextApiRequest } from 'next';
import redis from './redis';

export async function getUserIdFromSession(req: any): Promise<number | null> {
  // 1. 从 Cookie 中提取 session_id
  const cookies = req.headers.cookie || '';
  const sessionIdMatch = cookies.match(/session_id=([^;]+)/);
  if (!sessionIdMatch) return null;

  const sessionId = sessionIdMatch[1];
  
  // 2. 从 Redis 中获取对应的 user_id (对应 login.py 的存储逻辑)
  const userId = await redis.get(`session:${sessionId}`);
  return userId ? parseInt(userId) : null;
}
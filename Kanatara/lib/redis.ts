import Redis from 'ioredis';

// 这里的 URL 要对应你 docker-compose 里的服务名，通常是 redis:6379
const redis = new Redis(process.env.REDIS_URL || 'redis://redis:6379');

export default redis;
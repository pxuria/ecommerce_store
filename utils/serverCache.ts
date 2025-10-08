import redis from "@/lib/redis";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const cacheWithTTL = async (key: string, data: any, ttlMinutes: number) => {
    await redis.set(key, JSON.stringify(data), "EX", ttlMinutes * 60);
};

export const cachedData = async (key: string) => await redis.get(key);
export const delCachedData = async (key: string) => await redis.del(key);
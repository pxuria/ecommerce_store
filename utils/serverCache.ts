import redis from "@/lib/redis";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const cacheWithTTL = async (key: string, data: any, ttlMinutes: number) => {
    const stringifiedData = JSON.stringify(data);
    await redis.set(key, stringifiedData, "EX", ttlMinutes * 60);
};

export const cachedData = async (key: string) => {
    const raw = await redis.get(key);
    return raw ? JSON.parse(raw) : null;
};
export const delCachedData = async (key: string) => await redis.del(key);
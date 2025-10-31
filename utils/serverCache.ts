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

export async function delCachedPrefix(prefix: string) {
    const pattern = `${prefix}*`;
    const stream = redis.scanStream({ match: pattern, count: 100 });
    const keysToDelete: string[] = [];

    await new Promise<void>((resolve, reject) => {
        stream.on('data', (resultKeys: string[]) => {
            if (resultKeys.length) keysToDelete.push(...resultKeys);
        });
        stream.on('end', () => resolve());
        stream.on('error', (err) => reject(err));
    });

    if (keysToDelete.length > 0) {
        // delete in chunks to avoid argument limits if there are tons of keys
        const chunkSize = 500; // safe chunk
        for (let i = 0; i < keysToDelete.length; i += chunkSize) {
            const chunk = keysToDelete.slice(i, i + chunkSize);
            await redis.del(...chunk);
        }
    }

    return keysToDelete.length;
}
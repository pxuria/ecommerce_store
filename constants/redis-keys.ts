const makeRedisKeys = (name: string) => ({
    all: `${name}:all`,
    byId: `${name}:`,
});

export const redisKeys = {
    blogs: { ...makeRedisKeys("blogs"), latest: "blogs:latest" },
    brands: makeRedisKeys("brands"),
    categories: makeRedisKeys("categories"),
    colors: makeRedisKeys("colors"),
    countries: makeRedisKeys("countries"),
    orders: makeRedisKeys("orders"),
    products: makeRedisKeys("products"),
    users: makeRedisKeys("users"),
};
/** @type {import('next').NextConfig} */
const nextConfig = {
    // output: 'export',
    reactStrictMode: true,
    // swcMinify: true,
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "storage.c2.liara.space",
                pathname: "**"
            }
        ]
    }
};

export default nextConfig;

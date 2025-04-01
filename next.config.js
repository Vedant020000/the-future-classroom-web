/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    // Turn off eslint during build as it can cause deployment to fail if there are warnings
    eslint: {
        ignoreDuringBuilds: true,
    },
    // Ensure typescript errors don't prevent builds
    typescript: {
        ignoreBuildErrors: true,
    },
    // Fix CORS issues when communicating with PocketBase API
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'http://127.0.0.1:8090/api/:path*',
            },
        ];
    },
    // Configure allowed image domains
    images: {
        domains: ['127.0.0.1'],
    },
};

module.exports = nextConfig; 
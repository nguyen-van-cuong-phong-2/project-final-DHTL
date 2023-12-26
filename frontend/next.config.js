/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['localhost', '104.199.238.144'],
    },
}
const nodeExternals = require('webpack-node-externals');



module.exports = {
    ...nextConfig,
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.externals = [nodeExternals()];
        }

        return config;
    },
}

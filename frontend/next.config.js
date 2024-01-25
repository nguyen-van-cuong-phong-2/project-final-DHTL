/** @type {import('next').NextConfig} */
// const nodeExternals = require('webpack-node-externals');

const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['localhost', '104.199.238.144'],
    },
}



module.exports = nextConfig

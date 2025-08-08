/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // If you need larger request bodies on Vercel or your host, adjust below:
  api: {
    bodyParser: {
      sizeLimit: '50mb'
    }
  }
}
module.exports = nextConfig


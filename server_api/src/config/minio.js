const { Client } = require('minio')

const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT || '124.221.92.247',
  port: parseInt(process.env.MINIO_PORT, 10) || 9000,
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS_KEY || 'admin',
  secretKey: process.env.MINIO_SECRET_KEY || 'admin123',
})

const bucket = process.env.MINIO_BUCKET || 'uni_mall'
const publicDomain = process.env.MINIO_PUBLIC_DOMAIN || 'https://oss.ziwuxi.cn'

module.exports = { minioClient, bucket, publicDomain }

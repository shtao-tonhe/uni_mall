const path = require('path')
const { minioClient, bucket, publicDomain } = require('../config/minio')
const config = require('../config')

function generateFileName(originalName) {
  const ext = path.extname(originalName)
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  return `${timestamp}_${random}${ext}`
}

function generateObjectName(fileName) {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${config.upload.systemId}/${year}${month}${day}/${fileName}`
}

async function uploadFile(file) {
  const fileName = generateFileName(file.originalname)
  const objectName = generateObjectName(fileName)

  await minioClient.putObject(bucket, objectName, file.buffer, file.size, {
    'Content-Type': file.mimetype,
  })

  return {
    fileName,
    objectName,
    url: `${publicDomain}/${bucket}/${objectName}`,
  }
}

module.exports = { uploadFile, generateFileName, generateObjectName }

require('dotenv').config()

const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 3000,

  jwt: {
    secret: process.env.JWT_SECRET || 'uni_mall_jwt_secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },

  adminJwt: {
    secret: process.env.ADMIN_JWT_SECRET || 'uni_mall_admin_jwt_secret',
    expiresIn: process.env.ADMIN_JWT_EXPIRES_IN || '7d',
  },

  upload: {
    systemId: process.env.UPLOAD_SYSTEM_ID || 'uni_mall',
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    maxSize: 10 * 1024 * 1024,
  },

  wx: {
    appid: process.env.WX_APPID || '',
    secret: process.env.WX_APPSECRET || '',
  },

  sms: {
    accessKey: process.env.SMS_ACCESS_KEY || '',
    secretKey: process.env.SMS_SECRET_KEY || '',
    signName: process.env.SMS_SIGN_NAME || '商城',
    loginTemplate: process.env.SMS_LOGIN_TEMPLATE || '',
  },
}

module.exports = config

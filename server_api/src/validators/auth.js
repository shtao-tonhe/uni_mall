const { z } = require('zod')

const wxLoginSchema = z.object({
  code:          z.string().min(1, '登录code不能为空'),
  encryptedData: z.string().optional(),
  iv:            z.string().optional(),
  nickname:      z.string().max(64).optional(),
  avatar:        z.string().max(512).optional(),
  gender:        z.coerce.number().int().refine((v) => [0, 1, 2].includes(v)).optional(),
})

const sendCodeSchema = z.object({
  phone: z.string().regex(/^1\d{10}$/, '手机号格式不正确'),
})

const phoneLoginSchema = z.object({
  phone: z.string().regex(/^1\d{10}$/, '手机号格式不正确'),
  code:  z.string().length(6, '验证码为6位数字'),
})

module.exports = { wxLoginSchema, sendCodeSchema, phoneLoginSchema }

const { z } = require('zod')

const loginSchema = z.object({
  username: z.string().min(1, '账号不能为空'),
  password: z.string().min(1, '密码不能为空'),
})

const updateProfileSchema = z.object({
  nickname: z.string().max(64).optional(),
  avatar: z.string().max(512).optional(),
})

module.exports = { loginSchema, updateProfileSchema }

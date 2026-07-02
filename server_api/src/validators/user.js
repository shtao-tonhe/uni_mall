const { z } = require('zod')

const userUpdateSchema = z.object({
  nickname: z.string().max(64).optional(),
  avatar:   z.string().max(512).optional(),
  gender:   z.coerce.number().int().refine((v) => [0, 1, 2].includes(v)).optional(),
})

module.exports = { userUpdateSchema }

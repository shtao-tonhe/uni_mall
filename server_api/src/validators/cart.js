const { z } = require('zod')

const cartCreateSchema = z.object({
  productId: z.coerce.number().int().positive('商品ID必须大于0'),
  specId:    z.coerce.number().int().default(0),
  num:       z.coerce.number().int().min(1, '数量不能小于1').default(1),
})

const cartUpdateSchema = z.object({
  id:  z.string().min(1, 'id不能为空'),
  num: z.coerce.number().int().min(1, '数量不能小于1'),
})

const cartSelectedSchema = z.object({
  id:       z.string().min(1, 'id不能为空'),
  selected: z.coerce.number().int().refine((v) => [0, 1].includes(v), 'selected为0或1'),
})

const cartDeleteSchema = z.object({
  id: z.string().min(1, 'id不能为空'),
})

module.exports = { cartCreateSchema, cartUpdateSchema, cartSelectedSchema, cartDeleteSchema }

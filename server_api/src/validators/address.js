const { z } = require('zod')

const addressCreateSchema = z.object({
  consignee: z.string().min(1, '收货人不能为空').max(64),
  phone:     z.string().min(1, '联系电话不能为空').max(20),
  province:  z.string().min(1, '省不能为空').max(32),
  city:      z.string().min(1, '市不能为空').max(32),
  district:  z.string().min(1, '区不能为空').max(32),
  street:    z.string().max(64).default(''),
  detail:    z.string().min(1, '详细地址不能为空').max(256),
  isDefault: z.coerce.number().int().refine((v) => [0, 1].includes(v)).default(0),
})

const addressUpdateSchema = addressCreateSchema.extend({
  id: z.string().min(1, 'id不能为空'),
}).partial()

const addressIdSchema = z.object({ id: z.string().min(1, 'id不能为空') })

module.exports = { addressCreateSchema, addressUpdateSchema, addressIdSchema }

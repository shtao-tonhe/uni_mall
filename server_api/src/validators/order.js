const { z } = require('zod')

const orderItemSchema = z.object({
  productId: z.coerce.number().int().positive(),
  specId:    z.coerce.number().int().default(0),
  num:       z.coerce.number().int().min(1),
})

const orderCreateSchema = z.object({
  type:      z.enum(['cart', 'buy']),
  addressId: z.coerce.number().int().positive('请选择收货地址'),
  remark:    z.string().max(512).default(''),
  items:     z.array(orderItemSchema).optional(),
}).refine((data) => {
  if (data.type === 'buy' && (!data.items || data.items.length === 0)) return false
  return true
}, { message: '直接购买需指定商品items' })

const orderQuerySchema = z.object({
  page:     z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  status:   z.coerce.number().int().optional(),
})

const orderIdSchema = z.object({ id: z.string().min(1, 'id不能为空') })

const orderDeliverSchema = z.object({
  id:              z.string().min(1, 'id不能为空'),
  deliveryCompany: z.string().min(1, '物流公司不能为空').max(64),
  deliveryNo:      z.string().min(1, '物流单号不能为空').max(128),
})

module.exports = { orderCreateSchema, orderQuerySchema, orderIdSchema, orderDeliverSchema }

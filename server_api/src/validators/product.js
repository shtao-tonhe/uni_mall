const { z } = require('zod')

const productIdSchema = z.object({ id: z.string().min(1, 'id不能为空') })

const specItemSchema = z.object({
  specKey:  z.string().optional(),
  specName: z.string().min(1, '规格名称不能为空'),
  specs:    z.array(z.object({ name: z.string(), value: z.string() })).optional(),
  price:    z.coerce.number().min(0).default(0),
  stock:    z.coerce.number().int().min(0).default(0),
  image:    z.string().max(512).default(''),
})

const productCreateSchema = z.object({
  name:         z.string().min(1, '商品名称不能为空').max(256),
  image:        z.string().max(512).default(''),
  images:       z.string().optional(),
  video:        z.string().max(512).default(''),
  desc:         z.string().optional(),
  categoryId:   z.string().default(''),
  price:        z.coerce.number().min(0).default(0),
  marketPrice:  z.coerce.number().min(0).default(0),
  stock:        z.coerce.number().int().min(0).default(0),
  params:       z.string().optional(),
  specType:     z.coerce.number().int().refine((v) => [0, 1, 2].includes(v)).default(0),
  specData:     z.string().optional(),
  status:       z.coerce.number().int().refine((v) => [0, 1].includes(v)).default(1),
  isHot:        z.coerce.number().int().refine((v) => [0, 1].includes(v)).default(0),
  isNew:        z.coerce.number().int().refine((v) => [0, 1].includes(v)).default(0),
  isRecommend:  z.coerce.number().int().refine((v) => [0, 1].includes(v)).default(0),
  sort:         z.coerce.number().int().min(0).default(0),
  specs:        z.array(specItemSchema).optional(),
})

const productUpdateSchema = productCreateSchema.partial().extend({
  id: z.string().min(1, 'id不能为空'),
})

const productQuerySchema = z.object({
  page:        z.coerce.number().int().min(1).default(1),
  pageSize:    z.coerce.number().int().min(1).max(100).default(10),
  categoryId:  z.string().optional(),
  status:      z.coerce.number().int().optional(),
  keyword:     z.string().optional(),
})

module.exports = { productIdSchema, productCreateSchema, productUpdateSchema, productQuerySchema }

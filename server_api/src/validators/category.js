const { z } = require('zod')

const categoryCreateSchema = z.object({
  name:   z.string().min(1, '分类名称不能为空').max(64),
  pid:    z.coerce.number().int().min(0).default(0),
  sort:   z.coerce.number().int().min(0).default(0),
  status: z.coerce.number().int().refine((v) => [0, 1].includes(v)).default(1),
})

const categoryUpdateSchema = categoryCreateSchema.partial()

const categoryQuerySchema = z.object({
  page:     z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(100),
  status:   z.coerce.number().int().optional(),
})

module.exports = { categoryCreateSchema, categoryUpdateSchema, categoryQuerySchema }

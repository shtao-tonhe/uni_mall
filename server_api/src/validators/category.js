const { z } = require('zod')

const categoryIdSchema = z.object({ id: z.string().min(1, 'id不能为空') })

const categoryCreateSchema = z.object({
  name:   z.string().min(1, '分类名称不能为空').max(64),
  pid:    z.string().default(''),
  sort:   z.coerce.number().int().min(0).default(0),
  status: z.coerce.number().int().refine((v) => [0, 1].includes(v)).default(1),
})

const categoryUpdateSchema = z.object({
  id:     z.string().min(1, 'id不能为空'),
  name:   z.string().min(1, '分类名称不能为空').max(64).optional(),
  pid:    z.string().optional(),
  sort:   z.coerce.number().int().min(0).optional(),
  status: z.coerce.number().int().refine((v) => [0, 1].includes(v)).optional(),
}).refine((data) => data.id, { message: 'id不能为空' })

const categoryQuerySchema = z.object({
  page:     z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(100),
  status:   z.coerce.number().int().optional(),
})

module.exports = { categoryIdSchema, categoryCreateSchema, categoryUpdateSchema, categoryQuerySchema }

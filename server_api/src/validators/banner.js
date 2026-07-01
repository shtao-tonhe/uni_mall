const { z } = require('zod')

const bannerCreateSchema = z.object({
  title:      z.string().max(128, '标题不超过128字').default(''),
  image:      z.string().min(1, '图片地址不能为空'),
  jumpType:   z.coerce.number().int().refine((v) => [1, 2].includes(v), '跳转类型为1或2'),
  jumpTarget: z.string().min(1, '跳转目标不能为空').max(1024),
  startTime:  z.string().optional(),
  endTime:    z.string().optional(),
  status:     z.coerce.number().int().refine((v) => [0, 1].includes(v)).default(1),
  sort:       z.coerce.number().int().min(0).default(0),
})

const bannerUpdateSchema = bannerCreateSchema.partial()

const bannerQuerySchema = z.object({
  page:     z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  status:   z.coerce.number().int().optional(),
})

module.exports = { bannerCreateSchema, bannerUpdateSchema, bannerQuerySchema }

const { Router } = require('express')
const OrderController = require('../../controller/base/OrderController')
const { validate, validateQuery } = require('../../middleware/validator')
const { adminAuthRequired } = require('../../middleware/adminAuth')
const { orderQuerySchema, orderIdSchema, orderDeliverSchema } = require('../../validators/order')
const { z } = require('zod')

const router = Router()
router.use(adminAuthRequired)

const adminOrderQuerySchema = orderQuerySchema.extend({
  orderNo: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
})

router.get('/', validateQuery(adminOrderQuerySchema), OrderController.adminList.bind(OrderController))
router.get('/detail', validateQuery(orderIdSchema), OrderController.adminGetById.bind(OrderController))
router.post('/cancel', validate(orderIdSchema), OrderController.adminCancel.bind(OrderController))
router.post('/deliver', validate(orderDeliverSchema), OrderController.adminDeliver.bind(OrderController))

module.exports = router

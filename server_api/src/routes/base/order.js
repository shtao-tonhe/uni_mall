const { Router } = require('express')
const OrderController = require('../../controller/base/OrderController')
const { validate, validateQuery } = require('../../middleware/validator')
const { authRequired } = require('../../middleware/auth')
const { orderCreateSchema, orderQuerySchema, orderIdSchema, orderDeliverSchema } = require('../../validators/order')

const router = Router()

router.use(authRequired)

router.post('/',           validate(orderCreateSchema), OrderController.create.bind(OrderController))
router.get('/',            validateQuery(orderQuerySchema), OrderController.list.bind(OrderController))
router.get('/detail',      validateQuery(orderIdSchema), OrderController.getById.bind(OrderController))
router.post('/cancel',     validate(orderIdSchema), OrderController.cancel.bind(OrderController))
router.post('/confirm',    validate(orderIdSchema), OrderController.confirm.bind(OrderController))
router.post('/pay',        validate(orderIdSchema), OrderController.pay.bind(OrderController))
router.post('/deliver',    validate(orderDeliverSchema), OrderController.deliver.bind(OrderController))
router.post('/pay-simulate', validate(orderIdSchema), OrderController.simulatePay.bind(OrderController))
router.post('/delete',     validate(orderIdSchema), OrderController.remove.bind(OrderController))

module.exports = router

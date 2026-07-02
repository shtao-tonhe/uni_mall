const { Router } = require('express')
const CartController = require('../../controller/base/CartController')
const { validate } = require('../../middleware/validator')
const { authRequired } = require('../../middleware/auth')
const { cartCreateSchema, cartUpdateSchema, cartSelectedSchema, cartDeleteSchema } = require('../../validators/cart')

const router = Router()

router.use(authRequired)

router.get('/',          CartController.list.bind(CartController))
router.post('/',         validate(cartCreateSchema), CartController.add.bind(CartController))
router.post('/update',   validate(cartUpdateSchema), CartController.update.bind(CartController))
router.post('/selected', validate(cartSelectedSchema), CartController.toggleSelected.bind(CartController))
router.post('/delete',   validate(cartDeleteSchema), CartController.remove.bind(CartController))
router.post('/clear',    CartController.clear.bind(CartController))

module.exports = router

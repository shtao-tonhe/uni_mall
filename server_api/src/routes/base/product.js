const { Router } = require('express')
const ProductController = require('../../controller/base/ProductController')
const { validate, validateQuery } = require('../../middleware/validator')
const { authRequired } = require('../../middleware/auth')
const { productIdSchema, productCreateSchema, productUpdateSchema, productQuerySchema } = require('../../validators/product')

const router = Router()

router.get('/',        validateQuery(productQuerySchema), ProductController.list.bind(ProductController))
router.get('/detail',  validateQuery(productIdSchema), ProductController.getById.bind(ProductController))
router.post('/',       authRequired, validate(productCreateSchema), ProductController.create.bind(ProductController))
router.put('/',        authRequired, validate(productUpdateSchema), ProductController.update.bind(ProductController))
router.delete('/',     authRequired, validate(productIdSchema), ProductController.delete.bind(ProductController))

module.exports = router

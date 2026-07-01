const { Router } = require('express')
const CategoryController = require('../../controller/base/CategoryController')
const { validate, validateQuery } = require('../../middleware/validator')
const { authRequired } = require('../../middleware/auth')
const { categoryCreateSchema, categoryUpdateSchema, categoryQuerySchema } = require('../../validators/category')

const router = Router()

router.get('/tree',    CategoryController.tree.bind(CategoryController))
router.get('/all',     CategoryController.allFlat.bind(CategoryController))
router.get('/',        validateQuery(categoryQuerySchema), CategoryController.list.bind(CategoryController))
router.get('/:id',     CategoryController.getById.bind(CategoryController))
router.post('/',       authRequired, validate(categoryCreateSchema), CategoryController.create.bind(CategoryController))
router.put('/:id',     authRequired, validate(categoryUpdateSchema), CategoryController.update.bind(CategoryController))
router.delete('/:id',  authRequired, CategoryController.delete.bind(CategoryController))

module.exports = router

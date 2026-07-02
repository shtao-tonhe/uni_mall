const { Router } = require('express')
const CategoryController = require('../../controller/base/CategoryController')
const { validate, validateQuery } = require('../../middleware/validator')
const { adminAuthRequired } = require('../../middleware/adminAuth')
const { categoryIdSchema, categoryCreateSchema, categoryUpdateSchema, categoryQuerySchema } = require('../../validators/category')

const router = Router()

router.get('/tree',    CategoryController.tree.bind(CategoryController))
router.get('/all',     CategoryController.allFlat.bind(CategoryController))
router.get('/',        validateQuery(categoryQuerySchema), CategoryController.list.bind(CategoryController))
router.get('/detail',  validateQuery(categoryIdSchema), CategoryController.getById.bind(CategoryController))
router.post('/',       adminAuthRequired, validate(categoryCreateSchema), CategoryController.create.bind(CategoryController))
router.put('/',        adminAuthRequired, validate(categoryUpdateSchema), CategoryController.update.bind(CategoryController))
router.delete('/',     adminAuthRequired, validate(categoryIdSchema), CategoryController.delete.bind(CategoryController))

module.exports = router

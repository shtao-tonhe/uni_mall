const { Router } = require('express')
const BannerController = require('../../controller/base/BannerController')
const { validate, validateQuery } = require('../../middleware/validator')
const { authRequired } = require('../../middleware/auth')
const { bannerCreateSchema, bannerUpdateSchema, bannerQuerySchema } = require('../../validators/banner')

const router = Router()

router.get('/active', BannerController.listActive.bind(BannerController))
router.get('/',       validateQuery(bannerQuerySchema), BannerController.list.bind(BannerController))
router.get('/:id',    BannerController.getById.bind(BannerController))
router.post('/',      authRequired, validate(bannerCreateSchema), BannerController.create.bind(BannerController))
router.put('/:id',    authRequired, validate(bannerUpdateSchema), BannerController.update.bind(BannerController))
router.delete('/:id', authRequired, BannerController.delete.bind(BannerController))

module.exports = router

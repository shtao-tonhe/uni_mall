const { Router } = require('express')
const AddressController = require('../../controller/base/AddressController')
const { validate, validateQuery } = require('../../middleware/validator')
const { authRequired } = require('../../middleware/auth')
const { addressCreateSchema, addressUpdateSchema, addressIdSchema } = require('../../validators/address')

const router = Router()

router.use(authRequired)

router.get('/',          AddressController.list.bind(AddressController))
router.get('/detail',    validateQuery(addressIdSchema), AddressController.getById.bind(AddressController))
router.post('/',         validate(addressCreateSchema), AddressController.create.bind(AddressController))
router.put('/',          validate(addressUpdateSchema), AddressController.update.bind(AddressController))
router.put('/default',   validate(addressIdSchema), AddressController.setDefault.bind(AddressController))
router.delete('/',       validate(addressIdSchema), AddressController.delete.bind(AddressController))

module.exports = router

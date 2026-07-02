const { Router } = require('express')
const UserController = require('../../controller/base/UserController')
const { validate } = require('../../middleware/validator')
const { authRequired } = require('../../middleware/auth')
const { userUpdateSchema } = require('../../validators/user')

const router = Router()

router.use(authRequired)

router.get('/profile',    UserController.profile.bind(UserController))
router.put('/profile',    validate(userUpdateSchema), UserController.updateProfile.bind(UserController))

module.exports = router

const { Router } = require('express')
const AuthController = require('../../controller/base/AuthController')
const { validate } = require('../../middleware/validator')
const { wxLoginSchema, sendCodeSchema, phoneLoginSchema } = require('../../validators/auth')

const router = Router()

router.post('/wx-login',   validate(wxLoginSchema), AuthController.wxLogin.bind(AuthController))
router.post('/send-code',  validate(sendCodeSchema), AuthController.sendCode.bind(AuthController))
router.post('/phone-login', validate(phoneLoginSchema), AuthController.phoneLogin.bind(AuthController))

module.exports = router

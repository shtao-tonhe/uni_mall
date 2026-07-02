const { Router } = require('express')
const multer = require('multer')
const AdminController = require('../../controller/base/AdminController')
const { validate } = require('../../middleware/validator')
const { adminAuthRequired } = require('../../middleware/adminAuth')
const { loginSchema, updateProfileSchema } = require('../../validators/admin')
const config = require('../../config')
const { uploadFile } = require('../../utils/upload')
const { success, fail } = require('../../utils/response')

const router = Router()

router.post('/login', validate(loginSchema), AdminController.login.bind(AdminController))
router.get('/profile', adminAuthRequired, AdminController.profile.bind(AdminController))
router.put('/profile', adminAuthRequired, validate(updateProfileSchema), AdminController.updateProfile.bind(AdminController))

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: config.upload.maxSize },
  fileFilter(req, file, cb) {
    if (config.upload.allowedTypes.includes(file.mimetype) || file.mimetype.startsWith('video/')) {
      cb(null, true)
    } else {
      cb(new Error('不支持的文件类型，仅支持 jpg/png/gif/webp/mp4'))
    }
  },
})

router.post('/upload', adminAuthRequired, upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) return fail(res, '请选择文件')
    const result = await uploadFile(req.file)
    success(res, result, '上传成功')
  } catch (err) { next(err) }
})

module.exports = router

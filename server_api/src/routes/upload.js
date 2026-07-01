const { Router } = require('express')
const multer = require('multer')
const config = require('../config')
const { uploadFile } = require('../utils/upload')
const { success, fail } = require('../utils/response')
const { authRequired } = require('../middleware/auth')

const router = Router()
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: config.upload.maxSize },
  fileFilter(req, file, cb) {
    if (config.upload.allowedTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('不支持的文件类型，仅支持 jpg/png/gif/webp'))
    }
  },
})

router.post('/upload', authRequired, upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) return fail(res, '请选择文件')
    const result = await uploadFile(req.file)
    success(res, result, '上传成功')
  } catch (err) { next(err) }
})

module.exports = router

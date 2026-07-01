const { Router } = require('express')
const fs = require('fs')
const path = require('path')

const router = Router()

function mountRoutes(dir, prefix = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      mountRoutes(fullPath, `${prefix}/${entry.name}`)
    } else if (entry.name.endsWith('.js') && entry.name !== 'index.js') {
      const route = require(fullPath)
      const basePath = prefix + '/' + entry.name.replace(/\.js$/, '')
      router.use(basePath, route)
    }
  }
}

mountRoutes(__dirname)

module.exports = router

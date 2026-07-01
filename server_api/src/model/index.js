const fs = require('fs')
const path = require('path')
const sequelize = require('../config/database')

const models = {}

function loadModels(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      loadModels(fullPath)
    } else if (entry.name.endsWith('.js') && entry.name !== 'index.js') {
      const model = require(fullPath)
      const baseName = path.basename(entry.name, '.js')
      models[baseName] = model
      models[baseName.charAt(0).toLowerCase() + baseName.slice(1)] = model
    }
  }
}

loadModels(__dirname)

Object.values(models).forEach((model) => {
  if (typeof model.associate === 'function') model.associate(models)
})

module.exports = { models, sequelize }

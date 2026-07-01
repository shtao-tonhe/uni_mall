require('dotenv').config()

const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')

const config = require('./src/config')
const { sequelize } = require('./src/model/index')
const routes = require('./src/routes/index')
const errorHandler = require('./src/middleware/errorHandler')
const requestLogger = require('./src/middleware/logger')
const logger = require('./src/utils/logger')
const uploadRoutes = require('./src/routes/upload')

const app = express()

// security & parsing
app.use(helmet())
app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// request logging
app.use(requestLogger)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// health check
app.get('/health', (req, res) => {
  res.json({ code: 0, message: 'ok', timestamp: Date.now() })
})

// routes
app.use('/api/v1', routes)
app.use('/api/v1/upload', uploadRoutes)

// 404
app.use((req, res) => {
  res.status(404).json({ code: -1, message: '接口不存在' })
})

// error handler
app.use(errorHandler)

// start
async function start() {
  try {
    await sequelize.authenticate()
    logger.info('MySQL connected successfully')

    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync()
      logger.info('Database synced')
    }

    app.listen(config.port, () => {
      logger.info(`Server running on http://localhost:${config.port}`)
    })
  } catch (err) {
    logger.error('Failed to start server', { error: err.message })
    process.exit(1)
  }
}

start()

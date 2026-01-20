const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const config = require('./config')

const authRoutes = require('./routes/auth')
const productsRoutes = require('./routes/products')
const ordersRoutes = require('./routes/orders')
const adminRoutes = require('./routes/admin')
const paymentsRoutes = require('./routes/payments')

async function main() {
  await mongoose.connect(config.mongoUri)

  const app = express()
  app.use(cors())
  app.use(bodyParser.json({ limit: '5mb' }))

  app.use('/api/auth', authRoutes)
  app.use('/api/products', productsRoutes)
  app.use('/api/orders', ordersRoutes)
  app.use('/api/payments', paymentsRoutes)
  app.use('/api/admin', adminRoutes)

  // health checks
  app.get('/health/live', (req, res) =>
    res.status(200).json({ status: 'alive' })
  )

  app.get('/health/ready', (req, res) => {
    const ready = mongoose.connection.readyState === 1
    res.status(ready ? 200 : 503).json({
      status: ready ? 'ready' : 'not-ready',
      mongo: ready ? 'connected' : 'not-connected'
    })
  })

  app.get('/health', (req, res) => {
    const mongoState = mongoose.connection.readyState
    const isHealthy = mongoState === 1

    res.status(isHealthy ? 200 : 503).json({
      status: isHealthy ? 'UP' : 'DOWN',
      service: 'backend',
      mongo: isHealthy ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString()
    })
  })

  app.listen(config.port, () =>
    console.log('Server started on', config.port)
  )
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

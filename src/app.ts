import express, { Router as exRouter } from 'express'

export const app: express.Express = express()

const router = exRouter()

router.get('/', (req, res) => {
  res.status(200).send('ok')
})

app.use('/', router)

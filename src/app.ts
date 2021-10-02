import express, {
  NextFunction,
  Request,
  Response,
  Router as exRouter,
} from 'express'

export const app: express.Express = express()

const router = exRouter()

function headerCheck(req: Request, res: Response, next: NextFunction) {
  if (req.url.length > 10) {
    res
      .status(414)
      .send({ message: `URI length < 10 (${req.url}) = ${req.url.length}` })
    return
  }
  next()
}

router.use(headerCheck)

router.get('/', (req, res) => {
  res.status(200).send('ok')
})

app.use('/', router)

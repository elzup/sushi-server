import express, {
  NextFunction,
  Request,
  Response,
  Router as exRouter,
} from 'express'

export const app: express.Express = express()

app.use(express.json({ limit: '1kb' }))

const router = exRouter()

function webServer(req: Request, res: Response, next: NextFunction) {
  if (req.url.length > 10) {
    res
      .status(414)
      .send({ message: `URI length < 10 (${req.url}) = ${req.url.length}` })
    return
  }
  next()
}

function getApp(req: Request, res: Response, _next: NextFunction) {
  res.status(200).send('ok')
}

function postApp(req: Request, res: Response, _next: NextFunction) {
  res.status(201).send('ok')
}

router.use(webServer)

router.get('/', getApp)
router.post('/', postApp)

app.use('/', router)

import express, {
  NextFunction,
  Request,
  Response,
  Router as exRouter,
} from 'express'

export const app: express.Express = express()

const allowedMethods = ['GET', 'POST', 'PUT', 'DELETE']

function cors(req: Request, res: Response, next: NextFunction) {
  if (!allowedMethods.includes(req.method)) {
    res.status(501).end()
  }

  next()
}

const router = exRouter()

function webServer(req: Request, res: Response, next: NextFunction) {
  if (req.url.length > 10) {
    res
      .status(414)
      .send({ message: `URI length < 10 (${req.url}) = ${req.url.length}` })
      .end()
  }
  next()
}

function getApp(req: Request, res: Response, _next: NextFunction) {
  res.status(200).send('ok')
}

function postApp(req: Request, res: Response, _next: NextFunction) {
  res.status(201).send('ok')
}

app.use(express.json({ limit: '1kb' }))
app.use(cors)

app.use(webServer)

router.get('/', getApp)
router.post('/', postApp)

app.use('/', router)

import express, {
  NextFunction,
  Request,
  RequestHandler,
  Response,
  Router as exRouter,
} from 'express'

export const app: express.Express = express()
const router = exRouter()

const ALLOWED_METHODS = ['GET', 'POST', 'PUT', 'DELETE']

function cors(req: Request, res: Response, next: NextFunction) {
  if (!ALLOWED_METHODS.includes(req.method)) {
    res.status(501).end()
  }
  if (req.headers['expect'] === '100-continue') {
    res.status(417).end()
  }

  next()
}

function systemFilter(req: Request, res: Response, next: NextFunction) {
  if (req.url.length > 10) {
    res
      .status(414)
      .send({ message: `URI length < 10 (${req.url}) = ${req.url.length}` })
      .end()
  }
  next()
}

const getApp: RequestHandler = (req, res, _next) => {
  res.status(200).send('ok')
}

const postApp: RequestHandler = (req, res, _next) => {
  res.status(201).send('ok')
}

function putFaucet(
  req: Request<{}, { maked: string }, { thing: string }>,
  res: Response,
  _next: NextFunction
) {
  const { thing } = req.body

  if (thing === 'hand') {
    // @ts-ignore
    thing.wash.wash()
  }
  if (thing === 'yunomi') {
    res.send({ maked: 'Hot Green Tea' }).end()
  } else {
    res.status(400).end()
  }
}

const methodNotAllowed: RequestHandler = (req, res, _next) =>
  res.status(405).send()

app.use(express.json({ limit: '1kb' }))
app.use(cors)

app.use(systemFilter)

router.route('/').get(getApp).post(postApp).all(methodNotAllowed)
router.route('/faucet').put(putFaucet).all(methodNotAllowed)

app.use('/', router)

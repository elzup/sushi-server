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
const MAX_CONTENT = 1e3

function cors(req: Request, res: Response, next: NextFunction) {
  if (!ALLOWED_METHODS.includes(req.method)) {
    res.status(501).end()
  }
  const contentLength = Number(req.headers['content-length'] || 0)
  const has100Req = req.headers['expect'] === '100-continue'
  const contentLengthOver = contentLength > MAX_CONTENT

  if (has100Req) {
    if (contentLengthOver) {
      res.status(417).end()
    } else {
      res.writeContinue()
    }
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

function acceptFilter(req: Request, res: Response, next: NextFunction) {
  if (!req.acceptsCharsets('utf-8')) {
    res.status(406).end()
  }
  next()
}

const getApp: RequestHandler = (req, res, _next) => {
  res.status(200).send('ok')
}

// TODO: remove
const postApp: RequestHandler = (req, res, _next) => {
  res.status(201).send('ok')
}

type Order = {
  item: string
  count: number
}

const isOrder = (order: Record<string, string | number>): order is Order => {
  return typeof order['item'] === 'string' && typeof order['count'] === 'number'
}

const postOrder: RequestHandler = (req, res, _next) => {
  const order = req.body

  if (isOrder(order)) {
    res.status(201).send('ok')
  } else {
    res.status(400).end()
  }
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
  res.status(405).send().end()

app.use(express.json({ limit: MAX_CONTENT }))
app.use(cors)

app.use(systemFilter)
app.use(acceptFilter)

router.route('/').get(getApp).post(postApp).all(methodNotAllowed)
router.route('/order').post(postOrder).all(methodNotAllowed)
router.route('/faucet').put(putFaucet).all(methodNotAllowed)

app.use('/', router)

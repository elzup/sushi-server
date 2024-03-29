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
const URL_MAX_LENGTH = 100

function cors(req: Request, res: Response, next: NextFunction) {
  if (!ALLOWED_METHODS.includes(req.method)) {
    res.status(501).end()
  }
  const contentLength = Number(req.headers['content-length'] ?? 0)
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
  if (req.url.length > URL_MAX_LENGTH) {
    res.status(414).end()
  }
  next()
}

function acceptFilter(req: Request, res: Response, next: NextFunction) {
  if (req.acceptsCharsets('utf-8') !== 'utf-8') {
    res.status(406).end()
  }
  next()
}

function preconditionFilter(req: Request, res: Response, next: NextFunction) {
  const missing = false // TDOO

  if (missing) {
    // const missingHasPrecondition = false
    // if (missingHasPrecondition) {
    //   res.status(412).end()
    // }
    next()
  }

  next()
}

const getApp: RequestHandler = (req, res, next) => {
  res.status(200).send({ result: 'ok' }).end()
  next()
}

// TODO: remove
const postApp: RequestHandler = (req, res, next) => {
  res.status(201).send({ result: 'ok' }).end()
  next()
}

const putApp: RequestHandler = (req, res, next) => {
  res.status(200).send({ result: 'ok' }).end()
  next()
}

const postTako: RequestHandler = (req, res, _next) => {
  res.redirect(308, '/ika')
}

const postIka: RequestHandler = (req, res, next) => {
  res.status(200).send({ result: 'ok' }).end()
  next()
}

type Order = {
  item: string
  count: number
}

const isOrder = (order: Record<string, string | number>): order is Order => {
  return typeof order['item'] === 'string' && typeof order['count'] === 'number'
}
const isJsonReq: RequestHandler = (req, res, next) => {
  if (req.headers['content-type'] !== 'application/json') {
    res.status(415).end()
  }
  next()
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
    res.status(202).send({ maked: 'Hot Green Tea' }).end()
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
app.use(preconditionFilter)

router.route('/').get(getApp).post(postApp).put(putApp).all(methodNotAllowed)
router.route('/order').post(isJsonReq, postOrder).all(methodNotAllowed)
router.route('/faucet').put(putFaucet).all(methodNotAllowed)
router.use('/static', express.static(__dirname + '/public'))

router.route('/tako').post(postTako).all(methodNotAllowed)
router.route('/ika').post(postIka).all(methodNotAllowed)

app.use('/', router)

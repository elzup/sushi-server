import { watch } from 'fs'
import express, {
  NextFunction,
  Request,
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

app.use(express.json({ limit: '1kb' }))
app.use(cors)

app.use(webServer)

router.get('/', getApp)
router.post('/', postApp)
router.put('/faucet', putFaucet)

app.use('/', router)
